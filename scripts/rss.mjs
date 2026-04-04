import { writeFileSync, mkdirSync } from 'fs'
import path from 'path'
import { slug } from 'github-slugger'
import { escape } from 'pliny/utils/htmlEscaper.js'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeRaw from 'rehype-raw'
import siteMetadata from '../data/siteMetadata.js'
import tagData from '../app/tag-data.json' with { type: 'json' }
import { allBlogs } from '../.contentlayer/generated/index.mjs'
import { sortPosts } from 'pliny/utils/contentlayer.js'

const outputFolder = process.env.EXPORT ? 'out' : 'public'

async function markdownToHtml(markdown, siteUrl) {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(markdown)

  let html = String(result)

  // 1. Convert className to class (optional but cleaner for RSS)
  html = html.replace(/className=/g, 'class=')

  // 2. Fix the Image URLs
  return html.replace(/(<img\s[^>]*src=")([^"]*)(")/g, (match, p1, p2, p3) => {
    if (p2.startsWith('http')) return match

    const baseUrl = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl
    const path = p2.startsWith('/') ? p2 : `/${p2}`

    return `${p1}${baseUrl}${path}${p3}`
  })
}

const generateRssItem = (config, post, html) => `
  <item>
    <guid>${config.siteUrl}/blog/${post.slug}</guid>
    <title>${escape(post.title)}</title>
    <link>${config.siteUrl}/blog/${post.slug}</link>
    ${post.summary && `<description>${escape(post.summary)}</description>`}
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <author>${config.email} ${config.author}</author>
    ${post.tags && post.tags.map((t) => `<category>${t}</category>`).join('')}
    ${html ? `<content:encoded><![CDATA[${html}]]></content:encoded>` : ''}
  </item>
`

const generateRss = (config, items, lastBuildDate, page = 'feed.xml') => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
    <channel>
      <title>${escape(config.title)}</title>
      <link>${config.siteUrl}/blog</link>
      <description>${escape(config.description)}</description>
      <language>${config.language}</language>
      <managingEditor>${config.email} (${config.author})</managingEditor>
      <webMaster>${config.email} (${config.author})</webMaster>
      <lastBuildDate>${new Date(lastBuildDate).toUTCString()}</lastBuildDate>
      <atom:link href="${config.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
      ${items.join('')}
    </channel>
  </rss>
`

async function generateRSS(config, allBlogs, page = 'feed.xml') {
  const publishPosts = allBlogs.filter((post) => post.draft !== true)
  // RSS for blog post
  if (publishPosts.length > 0) {
    const sorted = sortPosts(publishPosts)
    const items = await Promise.all(
      sorted.map(async (post) => {
        const html = await markdownToHtml(post.body.raw, config.siteUrl)
        return generateRssItem(config, post, html)
      })
    )
    const rss = generateRss(config, items, sorted[0].date, page)
    writeFileSync(`./${outputFolder}/${page}`, rss)
  }

  if (publishPosts.length > 0) {
    for (const tag of Object.keys(tagData)) {
      const filteredPosts = allBlogs.filter((post) => post.tags.map((t) => slug(t)).includes(tag))
      const items = await Promise.all(
        filteredPosts.map(async (post) => {
          const html = await markdownToHtml(post.body.raw, config.siteUrl)
          return generateRssItem(config, post, html)
        })
      )
      const rss = generateRss(config, items, filteredPosts[0].date, `tags/${tag}/${page}`)
      const rssPath = path.join(outputFolder, 'tags', tag)
      mkdirSync(rssPath, { recursive: true })
      writeFileSync(path.join(rssPath, page), rss)
    }
  }
}

const rss = () => {
  generateRSS(siteMetadata, allBlogs)
  console.log('RSS feed generated...')
}
export default rss
