interface BlogCardProps {
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
}

const BlogCard = ({
  authorName,
  title,
  content,
  publishedDate,
}: BlogCardProps) => {
  return (
    <div className="rounded-xl  bg-white shadow-sm hover:shadow-lg transition-shadow cursor-pointer max-w-full">
      {/* Image */}
      <div className="aspect-video relative overflow-hidden rounded-t-xl">
        <img
          className="object-cover w-full h-full"
          src="https://i.ytimg.com/vi/FJxahb_wg2s/mqdefault.jpg"
          alt="Blog thumbnail"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 px-4 py-3">
        {/* Tags */}
        <div>
          {/* Example for showing tags */}
          <p className="rounded-full bg-gray-200 text-center text-xs w-8 px-2 py-1">
            +1
          </p>
        </div>

        {/* Title */}
        <h3 className="font-semibold line-clamp-2 tracking-tight text-base sm:text-lg">Getting started with react hooks</h3>

        {/* Description */}
        <p className="text-sm text-gray-700 line-clamp-2">Learn the fundamentals of react hooks and how they can simplify your component logic.</p>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center px-4 py-3 text-sm text-gray-600">
        <p className="line-clamp-1">John Doe</p>
        <div className="flex gap-1 items-center text-xs sm:text-sm">
          <p>jan 15, 2024</p>
          <span className="mx-1">·</span>
          <p>5 min read</p>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
