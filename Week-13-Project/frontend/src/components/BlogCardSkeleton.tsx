const BlogCardSkeleton = () => {
  return (
    <div className="h-full flex flex-col rounded-xl bg-white border border-gray-200 shadow-sm animate-pulse max-w-full">
      {/* Image skeleton */}
      <div className="aspect-video bg-gray-300 rounded-t-xl"></div>

      {/* Content skeleton */}
      <div className="flex flex-col flex-grow justify-between px-4 py-3 gap-2">
        {/* Tag */}
        <div className="w-8 h-5 bg-gray-300 rounded-full" />

        {/* Title */}
        <div className="h-5 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-full"></div>

        {/* Description */}
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-auto pt-2">
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="flex gap-1 items-center">
            <div className="h-3 bg-gray-300 rounded w-12"></div>
            <div className="h-3 w-1 bg-gray-300 rounded-full"></div>
            <div className="h-3 bg-gray-300 rounded w-16"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCardSkeleton