import { useEffect, useRef, useState } from "react"
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
import { useNavigate, useParams } from "react-router-dom"
import { fetchBlogById } from "./Blog"
import { useQuery } from "@tanstack/react-query"
import type { BlogPost } from "../types/types"
import { useAuth } from "../context/AuthContext"
import Spinner from "../components/Spinner"
import BlogNotFound from "./DetailsNotFound"

// helpers (paste near top of file)
function stableStringify(value: any) {
  return JSON.stringify(value, (_k, v) => {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      // sort object keys so order doesn't matter
      return Object.keys(v).sort().reduce((acc: any, key) => {
        acc[key] = v[key];
        return acc;
      }, {});
    }
    return v;
  });
}

function mapServerToBlogPost(resp: any): BlogPost {
    const src = resp?.blog ?? resp ?? {};
    const tags: string[] = Array.isArray(src.tags)
        ? src.tags.map((t: any) => (typeof t === "string" ? t : t?.name ?? "")).filter(Boolean)
        : [];

    return {
        title: src.title ?? "",
        content: src.content ?? "",
        published: !!src.published,
        tags,
        image: src.imageLink ?? src.image ?? null,
    };
}

export default function EditBlog() {
    
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
    const [isTagsOpen, setIsTagsOpen] = useState(true)
    const [autoSaveDialogue, setAutoSaveDialogue] = useState(false);
    const [preview, setPreview] = useState(false);
    const {id} = useParams();
    const navigate = useNavigate();
    const {user} = useAuth();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["blog", id],
        queryFn: () => fetchBlogById(id!),
        enabled: !!id,
        staleTime: 10 * 60 * 1000,
        retry: 0,                      // <-- don't retry failed queries
        refetchOnWindowFocus: false,   // <-- avoid refetch when user focuses tab
        refetchOnReconnect: false,     // <-- avoid refetch on network reconnect
        refetchOnMount: false,         // <-- skip refetch when component remounts if cached
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
          await api.put(`/api/v1/blog/${id}`, { blogPost });
          alert("Blog post updated successfully!");

          // Reset form
          setBlogPost({
            title: "",
            content: "",
            published: false,
            tags: [],
            image: null,
          });
          setImagePreview(null);
          setPreview(false);
          localStorage.removeItem(`autosave-${user?.email}-blogpost-${id}`);
          
        } 
        catch (err : any) {
          console.error("Error updating blog post:", err);
          console.log("err is ", err);
          alert(err?.response?.data?.message);
        } 
        finally {
          setIsSubmitting(false);
        }
    };


    const handleRestoreYes = () => {
        setAutoSaveDialogue(false);
        return;
    };

    const isFormValid = blogPost.title.trim() && blogPost.content.trim() && blogPost.tags.length>0 && blogPost.image;
    const skipNextAutosave = useRef(false);


     // 🟢 Restore from localStorage on first load
    // useEffect replacement
    useEffect(() => {
      if (!id) return;
      // wait for server response
      if (isLoading) return;
      if (isError) return;          // <-- don't run ownership/restore logic on error
      if(data?.blog?.author?.email!==user?.email){
        navigate("/");
      }
      

      const key = `autosave-${user?.email}-blogpost-${id}`;
      const savedStr = localStorage.getItem(key);

      const mapped = mapServerToBlogPost(data?.blog ?? {});
      const mappedStr = stableStringify(mapped);

      // no saved draft -> use server mapping
      if (!savedStr) {
        setBlogPost(mapped);
        setImagePreview(mapped.image);
        return;
      }

      // try parse saved
      let savedObj;
      try {
        savedObj = JSON.parse(savedStr);
      } catch (e) {
        // corrupted saved draft -> clear and use server
        localStorage.removeItem(key);
        setBlogPost(mapped);
        setImagePreview(mapped.image);
        return;
      }

      // if saved equals server -> use server
      if (stableStringify(savedObj) === mappedStr) {
        setBlogPost(mapped);
        setImagePreview(mapped.image);
        return;
      }

      // otherwise restore saved and show dialog
      skipNextAutosave.current = true;
      setBlogPost(savedObj);
      setImagePreview(savedObj.image ?? null);
      setAutoSaveDialogue(true);
    }, [id, data, isLoading]); // important: re-run when data arrives

     
    // 🟡 Auto-save when blogPost changes
    useEffect(() => {
      if (skipNextAutosave.current) {
        // 🛑 Skip only one autosave after restore
        skipNextAutosave.current = false;
        return;
      }
      
      const timeout = setTimeout(() => {
        const saved = localStorage.getItem(`autosave-${user?.email}-blogpost-${id}`);
        const newData = JSON.stringify(blogPost);
        if(newData==saved) return;
        localStorage.setItem(`autosave-${user?.email}-blogpost-${id}`, newData); // edit

      }, 1000); // Debounce

      return () => clearTimeout(timeout);
    }, [blogPost]);


    if (isLoading) return <Spinner />;

    
    if (isError) {
      // optionally examine `error` to show custom message
      return (
          <BlogNotFound type="blog" />
      );
    }



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
            <Autosave id={id} type={"editblog"} blog={data?.blog} mapServerToBlogPost={mapServerToBlogPost} handleRestoreYes={handleRestoreYes} setBlogPost={setBlogPost} setImagePreview={setImagePreview} setAutoSaveDialogue={setAutoSaveDialogue}/>
        )}

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between  gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Edit Your Blog Post</h2>
              <p className="text-sm sm:text-base text-gray-600">Share your thoughts and ideas with the world</p>
            </div>
            {
              ((blogPost.title || blogPost.content || blogPost.tags.length > 0 || blogPost.image)) &&
                  <DeleteData id={id} setBlogPost={setBlogPost} setImagePreview={setImagePreview}/>
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
              <ContentPreview blogPost={blogPost}/>
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
              > Update
              </button>
            </div>
          </form>
        </div>
      </div>
    )
}
