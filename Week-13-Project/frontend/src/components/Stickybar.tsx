import { useState } from "react";
import { FiSearch, FiChevronDown, FiChevronUp, FiX } from "react-icons/fi";
import { useFilter } from "../context/FilterContext";

const allTags = [
  "React", "JavaScript", "Web Development", "Cricket", "Sports",
  "Analytics", "Education", "Technology", "Learning", "Architecture",
  "Scalability", "World Cup", "Online Learning", "Study Tips"
];

export default function Stickybar() {
  const [open, setOpen] = useState(true);

  const {
    query,
    setQuery,
    selectedTags,
    setSelectedTags,
    customTagsInput,
    setCustomTagsInput,
    applyFilters,
    clearFilters,
  } = useFilter();

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <aside className="w-full sticky top-5  lg:w-99 p-4 bg-white rounded-lg shadow-md">
      {/* Search */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          Search Posts
        </label>
        <div className="relative text-gray-400">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
      </div>

      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="mb-4">
          <p className="text-gray-700 font-medium mb-2">
            Selected Tags ({selectedTags.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-black text-white text-sm rounded-full">
                {tag}
                <FiX className="cursor-pointer" onClick={() => toggleTag(tag)} />
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filter by Tags Toggle */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full text-gray-700 font-medium mb-2"
      >
        <span>Filter by Tags</span>
        {open ? <FiChevronUp /> : <FiChevronDown />}
      </button>

      {/* Tag List & Custom Input */}
      {open && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {allTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 flex items-center gap-1 text-sm rounded-full border transition cursor-pointer
                    ${
                      isSelected
                        ? "bg-black text-white border-white"
                        : "bg-white text-black font-semibold border-gray-300 hover:bg-gray-100"
                    }`}
                >
                  {tag} {isSelected }
                </button>
              );
            })}
          </div>

          <div className="mb-1">
            <label className="block text-gray-700 text-sm mb-2 mt-5">Custom Tags</label>
            <input
              type="text"
              placeholder="Add custom tags, separated by commas"
              value={customTagsInput}
              onChange={(e) => setCustomTagsInput(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={applyFilters}
          className="flex-1 py-2 bg-black text-white rounded-lg hover:opacity-70 transition cursor-pointer"
        >
          Apply
        </button>
        <button
          onClick={clearFilters}
          className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition cursor-pointer"
        >
          Clear
        </button>
      </div>
    </aside>
  );
}
