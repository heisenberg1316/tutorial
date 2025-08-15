
interface BlogTagsProps {
  tags: { id: string; name: string }[]
}

export default function BlogTags({ tags }: BlogTagsProps) {
  if (!tags?.length) return null

  console.log("tags is ", tags);

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-2 py-4 sm:py-6">
      <div className="border-t border-gray-200 pt-4 sm:pt-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors cursor-pointer"
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
