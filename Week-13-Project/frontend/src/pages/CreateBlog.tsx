import { useEffect, useRef, useState } from "react"
import { useForm } from "../context/FormContext"
import api from "../api/axios"
import Autosave from "../components/Autosave"
import BgOverlay from "../components/BgOverlay"
import DeleteData from "../components/DeleteData"
import TitleField from "../components/TitleField"
import ContentField from "../components/ContentField"
import TagsField from "../components/TagsField"
import PublishField from "../components/PublishedField"
import ImageField from "../components/ImageField"
import ContentPreview from "../components/ContentPreview"
import { useAuth } from "../context/AuthContext"

export default function CreatePage() {
    const {
      blogPost,
      setBlogPost,
      imagePreview,
      setImagePreview,
      newTag,
      setNewTag,
    } = useForm();

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isTagsOpen, setIsTagsOpen] = useState(true)
    const [autoSaveDialogue, setAutoSaveDialogue] = useState(false);
    const [preview, setPreview] = useState(false);
    const {user} = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate API call
        await api.post("/api/v1/blog", blogPost);
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
        setPreview(false)  
        localStorage.removeItem(`autosave-${user?.email}-blogpost`)
    }

    const handleRestoreYes = () => {
        setAutoSaveDialogue(false);
        return;
    };

    const isFormValid = blogPost.title.trim() && blogPost.content.trim() && blogPost.tags.length>0 && blogPost.image;
    const skipNextAutosave = useRef(false);


     // 🟢 Restore from localStorage on first load
    useEffect(() => {
      const saved = localStorage.getItem(`autosave-${user?.email}-blogpost`);
      console.log("saved is ", saved);
      
      if (saved && saved !== JSON.stringify(blogPost)) {
        const parsed = JSON.parse(saved);
        skipNextAutosave.current = true; // ✅ Skip next autosave
        setBlogPost(parsed);
        setImagePreview(parsed.image);
        setAutoSaveDialogue(true);
      }
    }, []);
    
    // 🟡 Auto-save when blogPost changes
    useEffect(() => {
      if (skipNextAutosave.current) {
        // 🛑 Skip only one autosave after restore
        skipNextAutosave.current = false;
        return;
      }
      
      const timeout = setTimeout(() => {
        const saved = localStorage.getItem(`autosave-${user?.email}-blogpost`);
        const newData = JSON.stringify(blogPost);
        if(newData==saved) return;
        localStorage.setItem(`autosave-${user?.email}-blogpost`, newData); // create
      }, 1000); // Debounce

      return () => clearTimeout(timeout);
    }, [blogPost]);


    return (
      <div className="min-h-screen bg-gray-50 mt-1 -mx-6">
        {
          // bg overlay
          autoSaveDialogue && (
              <BgOverlay />
          )
        }

        {/* autosave dialogue */}
        {autoSaveDialogue && (
            <Autosave type="createblog" handleRestoreYes={handleRestoreYes} setBlogPost={setBlogPost} setImagePreview={setImagePreview} setAutoSaveDialogue={setAutoSaveDialogue}/>
        )}

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between  gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Create New Blog Post</h2>
              <p className="text-sm sm:text-base text-gray-600">Share your thoughts and ideas with the world</p>
            </div>
            {
              ((blogPost.title || blogPost.content || blogPost.tags.length > 0 || blogPost.image)) &&
                  <DeleteData setBlogPost={setBlogPost} setImagePreview={setImagePreview}/>
            }
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title Card */}
            <TitleField title={blogPost.title} setTitle={(title) => setBlogPost(prev => ({ ...prev, title }))} />

            {/* Image Upload Card */}
            <ImageField
              imagePreview={imagePreview}
              setImagePreview={setImagePreview}
              setBlogPost={setBlogPost}
            />

            {/* Content Card */}
            <ContentField content={blogPost.content}  setContent={(content) => setBlogPost(prev => ({ ...prev, content }))} />

            <button onClick={(e) => {
                e.preventDefault();
                setPreview(!preview)
            }} className="cursor-pointer bg-blue-600 px-2 py-2 text-white rounded-lg hover:bg-blue-800">
               {preview ? "Close" : "Preview"}
            </button>
            {
              preview && 
              <ContentPreview blogPost={blogPost} />
            }

            {/* Tags Card */}
            <TagsField
              newTag={newTag}
              setNewTag={setNewTag}
              blogPost={blogPost}
              setBlogPost={setBlogPost}
              isTagsOpen={isTagsOpen}
              setIsTagsOpen={setIsTagsOpen}
            />

            {/* Publish Settings Card */}
            <PublishField
              published={blogPost.published}
              setPublished={(published) =>
                setBlogPost((prev) => ({ ...prev, published }))
              }
            />

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:pt-2">
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting} 
                className={`flex-1 px-4 py-2 text-sm sm:text-base font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                  !isFormValid || isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                }`}
              >
                {isSubmitting ? "Saving..." : blogPost.published ? "Publish Post" : "Save Draft"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
}
