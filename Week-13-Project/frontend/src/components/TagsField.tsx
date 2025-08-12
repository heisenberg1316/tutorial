import type { BlogPost } from "../types/types"
import { availableTags } from "../types/tagsData"

type TagsFieldProps = {
  newTag: string
  setNewTag: (tag: string) => void
  blogPost : BlogPost
  setBlogPost : React.Dispatch<React.SetStateAction<BlogPost>>
  isTagsOpen : boolean,
  setIsTagsOpen :  React.Dispatch<React.SetStateAction<boolean>>
}

const TagsField = ({ newTag, setNewTag, blogPost, setBlogPost, isTagsOpen, setIsTagsOpen} : TagsFieldProps) => {

    newTag = newTag.toLowerCase();

    const handleTagToggle = (tag: string) => {
        tag = tag.toLowerCase();
        setBlogPost((prev) => ({
            ...prev,
            tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
        }))
    }

    const handleAddCustomTag = () => {
      if (newTag.trim() && !blogPost.tags.includes(newTag.trim())) {
        setBlogPost((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag.trim()],
        }))
        setNewTag("")
      }
    }

    return (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Tags</h3>
                    <p className="text-sm text-gray-600 mt-1">Add tags to help readers discover your content</p>
                </div>
                <div className="p-4 sm:p-6 space-y-4">
                    {/* Selected Tags */}
                    {blogPost.tags.length > 0 && (
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Selected Tags ({blogPost.tags.length})
                        </label>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                        {blogPost.tags.map((tag) => (
                            <span onClick={() => handleTagToggle(tag)}
                            key={tag}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-colors"
                            >
                            {tag}
                            <svg
                                className="ml-1 h-3 w-3 hover:text-gray-200"
                                
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            </span>
                        ))}
                        </div>
                    </div>
                    )}
    
                    {/* Add Custom Tag */}
                    <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Add Custom Tag</label>
                    <div className="flex gap-2">
                        <input
                        type="text"
                        placeholder="Enter custom tag..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCustomTag())}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                        <button
                        type="button"
                        onClick={handleAddCustomTag}
                        className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        </button>
                    </div>
                    </div>
    
                    <div className="border-t border-gray-200 pt-4">
                    {/* Available Tags - Collapsible */}
                    <button
                        type="button"
                        onClick={() => setIsTagsOpen(!isTagsOpen)}
                        className="w-full flex items-center justify-between text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                    >
                        <span>Popular Tags</span>
                        <svg
                        className={`h-4 w-4 cursor-pointer transform transition-transform ${isTagsOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
    
                    {isTagsOpen && (
                        <div className="mt-3 flex flex-wrap gap-1 sm:gap-2">
                        {availableTags.map((tag) => (
                            <span
                            key={tag}
                            onClick={() => handleTagToggle(tag)}
                            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md cursor-pointer transition-colors ${
                                blogPost.tags.includes(tag)
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                            }`}
                            >
                            {tag}
                            {blogPost.tags.includes(tag) && (
                                <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                                </svg>
                            )}
                            </span>
                        ))}
                        </div>
                    )}
                    </div>
                </div>
            </div>
    )
}

export default TagsField
