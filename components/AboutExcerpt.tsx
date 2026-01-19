import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { coreContent } from 'pliny/utils/contentlayer'
import Image from '@/components/Image'

export default function AboutExcerpt() {
  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  const { name, avatar, occupation, company } = coreContent(author)

  return (
    <div className="mb-8">
      <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:space-y-0 xl:gap-x-8">
        <div className="flex flex-col items-center space-x-2 pt-8">
          {avatar && (
            <Image
              src={avatar}
              alt="avatar"
              width={192}
              height={192}
              className="h-48 w-48 rounded-full"
            />
          )}
          <h3 className="pt-4 pb-2 text-2xl leading-8 font-bold tracking-tight">{name}</h3>
          <div className="text-gray-500 dark:text-gray-400">{occupation}</div>
          <div className="text-gray-500 dark:text-gray-400">{company}</div>
        </div>
        <div className="prose dark:prose-invert max-w-none pt-8 pb-8 xl:col-span-2">
          <MDXLayoutRenderer code={author.body.code} />
        </div>
      </div>
    </div>
  )
}
