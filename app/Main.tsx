import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import AboutExcerpt from '@/components/AboutExcerpt'
import ExternalLinkIcon from '@/components/ExternalLinkIcon'

const MAX_DISPLAY = 50

export default function Home({ posts }) {
  return (
    <>
      {/* SEO optimized heading structure - H1 invisible to users but present for search engines */}
      <h1 className="sr-only">Aymeric FYI</h1>

      {/* About section contains H2 */}
      <section>
        <AboutExcerpt />
      </section>

      {/* Writing section contains H2 */}
      <section>
        <div className="xl:grid xl:grid-cols-3 xl:gap-x-8">
          <ul className="xl:col-span-3 xl:grid xl:grid-cols-3 xl:gap-x-8">
            {!posts.length && 'No posts found.'}
            {posts.slice(0, MAX_DISPLAY).map((post) => {
              const { slug, date, title, summary, tags, url } = post
              const isExternal = !!url
              const linkHref = isExternal ? url : `/blog/${slug}`
              return (
                <li key={slug} className="py-1 xl:col-span-3 xl:grid xl:grid-cols-3 xl:gap-x-8">
                  <article className="flex flex-col space-y-0.5 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4 xl:col-span-3 xl:grid xl:grid-cols-3 xl:gap-x-8">
                    <div className="w-full sm:flex-shrink-0 xl:col-span-1 xl:text-right">
                      <time
                        dateTime={date}
                        className="text-l leading-6 font-medium text-gray-500 dark:text-gray-400"
                      >
                        {formatDate(date, siteMetadata.locale)}
                      </time>
                    </div>
                    <div className="flex-1 xl:col-span-2">
                      <h2 className="text-l leading-8 font-bold tracking-tight">
                        <Link
                          href={linkHref}
                          className="flex items-center gap-1 text-gray-900 dark:text-gray-100"
                          {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
                        >
                          {title}
                          {isExternal && (
                            <ExternalLinkIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          )}
                        </Link>
                      </h2>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
          {posts.length > MAX_DISPLAY && (
            <div className="flex justify-end text-base leading-6 font-medium xl:col-span-3">
              <Link
                href="/blog"
                className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                aria-label="All posts"
              >
                All Posts &rarr;
              </Link>
            </div>
          )}
        </div>
      </section>

      {siteMetadata.newsletter?.provider && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )}
    </>
  )
}
