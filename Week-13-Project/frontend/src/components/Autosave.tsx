import type { BlogPost } from "../types/types";

interface AutosaveProps {
    id ?: string;
    type : string;
    blog ?: BlogPost;
    handleRestoreYes: () => void;
    mapServerToBlogPost ?: (resp: any) => BlogPost; // <-- properly typed
    setBlogPost: React.Dispatch<React.SetStateAction<BlogPost>>;
    setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
    setAutoSaveDialogue: React.Dispatch<React.SetStateAction<boolean>>;
}


const Autosave = ({id, type, blog, mapServerToBlogPost, handleRestoreYes, setBlogPost, setImagePreview, setAutoSaveDialogue} : AutosaveProps ) => {
  return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md text-center">
                <h2 className="text-xl font-semibold mb-4">Restore Draft?</h2>
                <p className="text-gray-700 mb-6">
                You have unsaved changes from your previous session. Do you want to restore them?
                </p>
                <div className="flex justify-center gap-4">
                <button
                    onClick={handleRestoreYes}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                    Yes, Restore
                </button>
                <button
                    onClick={() => {
                        localStorage.removeItem(`autosave-blogpost-${id}`)
                        if(type=="editblog"){
                            console.log("blog is ", blog);
                            const mapped = mapServerToBlogPost(blog); // `blog` is the server response
                            setBlogPost(mapped);
                            setAutoSaveDialogue(false)
                            setImagePreview(mapped.image);
                        }
                        else{
                            setBlogPost({
                                title: "",
                                content: "",
                                published: false,
                                tags: [],
                                image: null,
                            })
                            setAutoSaveDialogue(false)
                            setImagePreview(null)
                        }
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                >
                    No, Discard
                </button>
                </div>
            </div>
        </div>
  )
}

export default Autosave