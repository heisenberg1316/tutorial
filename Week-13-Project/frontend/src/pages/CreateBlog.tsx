"local storage draft reamining"

import type React from "react"
import { useEffect, useState } from "react"

const availableTags = [
  "React",
  "JavaScript",
  "Web Development",
  "Cricket",
  "Sports",
  "Analytics",
  "Education",
  "Technology",
  "Learning",
  "Architecture",
  "Scalability",
  "World Cup",
  "Online Learning",
  "Study Tips",
  "Node.js",
  "Python",
  "AI/ML",
  "Design",
  "Business",
  "Health",
]

interface BlogPost {
    title: string
    content: string
    published: boolean
    tags: string[]
    image: string | null
  }

export default function CreatePage() {
    const [blogPost, setBlogPost] = useState<BlogPost>({
        title: "",
        content: "",
        published: false,
        tags: [],
        image: null,
    })

    const [newTag, setNewTag] = useState("")
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isTagsOpen, setIsTagsOpen] = useState(false)
    const [autoSaveDialogue, setAutoSaveDialogue] = useState(false);
    
    const handleTagToggle = (tag: string) => {
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

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          setImagePreview(result)
          setBlogPost((prev) => ({ ...prev, image: result }))
        }
        reader.readAsDataURL(file)
      }
    }

    const handleRemoveImage = () => {
      setImagePreview(null)
      setBlogPost((prev) => ({ ...prev, image: null }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))

        console.log("Blog post submitted:", blogPost)
        alert(`Blog post ${blogPost.published ? "published" : "saved as draft"} successfully!`)

        // Reset form
        setBlogPost({
          title: "",
          content: "",
          published: false,
          tags: [],
          image: null,
        })
        setImagePreview(null)
        setIsSubmitting(false)  
        localStorage.removeItem("autosave-blogpost")
    }

    const isFormValid = blogPost.title.trim() && blogPost.content.trim()

    useEffect(() => {
        const savedData = localStorage.getItem("autosave-blogpost")
        const defaultData = JSON.stringify({
          title: "",
          content: "",
          published: false,
          tags: [],
          image: null,
        })

        if (savedData && savedData !== defaultData) {
          const parsed: BlogPost = JSON.parse(savedData)
          setBlogPost(parsed)
          setImagePreview(parsed.image)
          setAutoSaveDialogue(true)
        }
    }, [])

    useEffect(() => {
        const savedData2 = localStorage.getItem("autosave-blogpost")        
        if(savedData2==JSON.stringify(blogPost)){
          return;
        };
        const timeout = setTimeout(() => {
          localStorage.setItem("autosave-blogpost", JSON.stringify(blogPost))
          console.log("Autosaved to localStorage")
        }, 1000) // debounce: save 1s after user stops typing
        return () => clearTimeout(timeout)
    }, [blogPost])



    return (
      <div className="min-h-screen bg-gray-50 -mx-6">
        {
          // bg overlay
          autoSaveDialogue && (
            <div className="fixed inset-0 z-40 bg-black opacity-80 backdrop-blur-sm transition-opacity duration-300"/>
          )
        }

        {/* autosave dialogue */}
        {autoSaveDialogue && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md text-center">
              <h2 className="text-xl font-semibold mb-4">Restore Draft?</h2>
              <p className="text-gray-700 mb-6">
                You have unsaved changes from your previous session. Do you want to restore them?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    const savedData = localStorage.getItem("autosave-blogpost")
                    if (savedData) {
                      const parsed: BlogPost = JSON.parse(savedData)
                      setBlogPost(parsed)
                      setImagePreview(parsed.image)
                    }
                    setAutoSaveDialogue(false)
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Yes, Restore
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem("autosave-blogpost")
                    setBlogPost({
                      title: "",
                      content: "",
                      published: false,
                      tags: [],
                      image: null,
                    })
                    setImagePreview(null)
                    setAutoSaveDialogue(false)
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                >
                  No, Discard
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Create New Blog Post</h2>
            <p className="text-sm sm:text-base text-gray-600">Share your thoughts and ideas with the world</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-8">
            {/* Title Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Post Title</h3>
                <p className="text-sm text-gray-600 mt-1">Give your blog post a compelling title</p>
              </div>
              <div className="p-4 sm:p-6">
                <input
                  type="text"
                  placeholder="Enter your blog post title..."
                  value={blogPost.title}
                  onChange={(e) => setBlogPost((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 text-base sm:text-lg font-medium border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Image Upload Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Featured Image</h3>
                <p className="text-sm text-gray-600 mt-1">Upload an image to make your post more engaging</p>
              </div>
              <div className="p-4 sm:p-6">
                {!imagePreview ? (
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
                    <svg
                      className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mb-2 sm:mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <div className="space-y-1 sm:space-y-2">
                      <p className="text-xs sm:text-sm text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <div className="aspect-video relative overflow-hidden rounded-lg">
                      <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Content</h3>
                <p className="text-sm text-gray-600 mt-1">Write your blog post content</p>
              </div>
              <div className="p-4 sm:p-6">
                <textarea
                  placeholder="Start writing your blog post..."
                  value={blogPost.content}
                  onChange={(e) => setBlogPost((prev) => ({ ...prev, content: e.target.value }))}
                  className="w-full min-h-[200px] sm:min-h-[300px] px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors"
                  required
                />
                <div className="mt-2 text-xs sm:text-sm text-gray-500">{blogPost.content.length} characters</div>
              </div>
            </div>

            {/* Tags Card */}
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
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-colors"
                        >
                          {tag}
                          <svg
                            className="ml-1 h-3 w-3 hover:text-gray-200"
                            onClick={() => handleTagToggle(tag)}
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

            {/* Publish Settings Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Publish Settings</h3>
                <p className="text-sm text-gray-600 mt-1">Choose whether to publish immediately or save as draft</p>
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {blogPost.published ? (
                      <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    )}
                    <div>
                      <label className="text-sm font-medium text-gray-900">
                        {blogPost.published ? "Publish immediately" : "Save as draft"}
                      </label>
                      <p className="text-xs text-gray-500">
                        {blogPost.published
                          ? "Your post will be visible to everyone"
                          : "Your post will be saved privately"}
                      </p>
                    </div>
                  </div>

                  {/* Custom Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => setBlogPost((prev) => ({ ...prev, published: !prev.published }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      blogPost.published ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        blogPost.published ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting} 
                className={`flex-1 px-4 py-2 text-sm sm:text-base font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                  !isFormValid || isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSubmitting ? "Saving..." : blogPost.published ? "Publish Post" : "Save Draft"}
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm sm:text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                Preview
              </button>
            </div>
          </form>
        </div>
      </div>
    )
}
