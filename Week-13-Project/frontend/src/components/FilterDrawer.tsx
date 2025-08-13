import { useFilter } from "../context/FilterContext";

const tagsList = [
  "React", "JavaScript", "Web Development", "Cricket", "Sports",
  "Analytics", "Education", "Technology", "Learning", "Architecture",
  "Scalability", "World Cup", "Online Learning", "Study Tips"
];

const FilterDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const {
    query, setQuery,
    selectedTags, setSelectedTags,
    customTagsInput, setCustomTagsInput,
    applyFilters, clearFilters
  } = useFilter();

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div
      className={`fixed  h-[82%] bottom-0 left-0 w-full bg-white border-t transition-transform duration-500 z-50
        ${isOpen ? "translate-y-0" : "translate-y-full"}`}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Filter Posts</h2>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>

        <input
          type="text"
          className="w-full px-4 py-2 mb-4 border rounded"
          placeholder="Search posts..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />

        <div className="mb-4">
          <p className="mb-2 font-medium">Filter by Tags</p>
          <div className="flex flex-wrap gap-2">
            {tagsList.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full border text-sm ${
                  selectedTags.includes(tag)
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-400"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-1">
          <label className="block text-gray-700 text-sm mb-2">Custom Tags</label>
          <input
            type="text"
            placeholder="Add custom tags, separated by commas"
            value={customTagsInput}
            onChange={(e) => setCustomTagsInput(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <div className="flex gap-2 mt-6">
          <button
            className="flex-1 bg-black text-white py-2 rounded"
            onClick={() => {
              applyFilters();
              onClose();
            }}
          >
            Apply
          </button>
          <button
            className="flex-1 border py-2 rounded"
            onClick={() => {
              clearFilters();
              onClose();
            }}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterDrawer;
