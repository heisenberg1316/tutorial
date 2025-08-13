import type { BlogPost, UserType } from "./types";

export type AuthContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn : React.Dispatch<React.SetStateAction<boolean>>;
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
  setSelectedTags: (t: string[] | ((prev: string[]) => string[])) => void;
  customTagsInput: string;
  setCustomTagsInput: (s: string) => void;

  // applied snapshots (set when user clicks Apply)
  finalTags: string[];
  finalQuery: string;

  applyFilters: () => void;
  clearFilters: () => void;
};

