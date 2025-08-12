import { createContext, useContext, useState } from "react";
import type { BlogPost} from "../types/types";
import type { FormContextType } from "../types/contextTypes";

// Create context
const FormContext = createContext<FormContextType | undefined>(undefined);

//provider
export function FormProvider({children} : { children: React.ReactNode }){
    const [blogPost, setBlogPost] = useState<BlogPost>({
        title: "",
        content: "",
        published: false,
        tags: [],
        image: null,
    })

    const [newTag, setNewTag] = useState("")
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    

    return (
        <FormContext.Provider value={{ blogPost, setBlogPost, newTag, setNewTag, imagePreview, setImagePreview }}>
        {children}
        </FormContext.Provider>
    )
}


// Custom hook
export function useForm() {
  const context = useContext(FormContext);
  if (!context) throw new Error('useForm must be used within useForm');
  return context;
}
