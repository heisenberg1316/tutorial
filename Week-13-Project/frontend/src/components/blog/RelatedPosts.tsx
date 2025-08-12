"use client"

interface RelatedPost {
  id: number
  title: string
  description: string
  author: string
  readTime: string
  image?: string
}

interface RelatedPostsProps {
  posts: RelatedPost[]
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts.length) return null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="border-t border-gray-200 pt-6 sm:pt-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Related Posts</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <a
              key={post.id}
              href={`/blog/${post.id}`}
              className="group block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              {post.image && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{post.author}</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
