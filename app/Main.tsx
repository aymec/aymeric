
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
      <AboutExcerpt />
      <div className="xl:grid xl:grid-cols-3 xl:gap-x-8">
        <div className="xl:col-start-2 xl:col-span-2">
          <div className="space-y-2 pt-6 pb-8 md:space-y-5">
            <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
              Writing
            </h1>
            <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
              {siteMetadata.description}
            </p>
          </div>
          <ul>
            {!posts.length && 'No posts found.'}
          {posts.slice(0, MAX_DISPLAY).map((post) => {
            const { slug, date, title, summary, tags, url } = post
            const isExternal = !!url
            const linkHref = isExternal ? url : `/blog/${slug}`
            return (
              <li key={slug} className="py-1">
                <article>
                  <div className="flex flex-col space-y-0.5 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                    <dl className="sm:w-40 sm:flex-shrink-0">
                      <dt className="sr-only">Published on</dt>
                      <dd className="text-l leading-6 font-medium text-gray-500 dark:text-gray-400">
                        <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                      </dd>
                    </dl>
                    <div className="flex-1">
                      <h2 className="text-l leading-8 font-bold tracking-tight">
                        <Link
                          href={linkHref}
                          className="text-gray-900 dark:text-gray-100 flex items-center gap-1"
                          {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
                        >
                          {title}
                          {isExternal && (
                            <ExternalLinkIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          )}
                        </Link>
                      </h2>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
        {posts.length > MAX_DISPLAY && (
          <div className="flex justify-end text-base leading-6 font-medium">
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
      </div>
      {siteMetadata.newsletter?.provider && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )}
    </>
  )
}
