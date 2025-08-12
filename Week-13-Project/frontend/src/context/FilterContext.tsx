import { createContext, useContext, useState } from "react";
import React from "react";
import type { FilterContextType } from "../types/contextTypes";

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTagsInput, setCustomTagsInput] = useState("");
  const [finalTags, setFinalTags] = useState<string[]>([]);

  const applyFilters = () => {
    const custom = customTagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);
    const combined = Array.from(new Set([...selectedTags, ...custom]));
    setFinalTags(combined);
  };

  const clearFilters = () => {
    setQuery("");
    setSelectedTags([]);
    setCustomTagsInput("");
    setFinalTags([]);
  };

  return (
    <FilterContext.Provider
      value={{
        query,
        setQuery,
        selectedTags,
        setSelectedTags,
        customTagsInput,
        setCustomTagsInput,
        finalTags,
        applyFilters,
        clearFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilter must be used inside FilterProvider");
  return ctx;
};
