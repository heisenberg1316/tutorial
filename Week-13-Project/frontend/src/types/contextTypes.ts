import type { BlogPost, UserType } from "./types";

export type AuthContextType = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  loading : boolean;
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
};


export type FormContextType = {
    blogPost : BlogPost;
    setBlogPost: React.Dispatch<React.SetStateAction<BlogPost>>;
    newTag : string;
    setNewTag: React.Dispatch<React.SetStateAction<string>>;
    imagePreview : string | null;
    setImagePreview : React.Dispatch<React.SetStateAction<string | null>>;
}

export type FilterContextType = {
  query: string;
  setQuery: (q: string) => void;

  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;

  customTagsInput: string;
  setCustomTagsInput: (val: string) => void;

  finalTags: string[]; // selected + custom
  applyFilters: () => void;
  clearFilters: () => void;
};
