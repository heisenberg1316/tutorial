import { memo } from "react";

interface BlogCardProps {
  blog: {
    id: string;
    author: {
      name: string;
    };
    title: string;
    content: string;
    publishedDate?: string;
    createdAt: string;
    imageLink: string;
    tags: {
      id: string;
      name: string;
    }[];
  };
}

const BlogCard = memo(({ blog }: BlogCardProps) => {
  return (
    <div className="h-full flex flex-col rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-shadow cursor-pointer max-w-full group">
      {/* Image */}
      <div className="aspect-video relative overflow-hidden rounded-t-xl">
        <img
          className="object-cover w-full h-full transition-transform duration-1500 ease-in-out group-hover:scale-110"
          src={blog.imageLink}
          alt="Blog thumbnail"
        />
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-grow justify-between px-4 py-3 gap-2">
        {/* Tags */}
        <p className="rounded-full bg-gray-200 text-center text-xs w-8 px-2 py-1">+1</p>

        {/* Title */}
        <h3 className="font-semibold line-clamp-2 tracking-tight text-base sm:text-lg">
          {blog.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-700 line-clamp-2">{blog.content}</p>

        {/* Footer */}
        <div className="flex justify-between gap-2 items-center text-sm text-gray-600 mt-auto pt-2">
          <p className="line-clamp-1">{blog.author.name}</p>
          <div className="flex gap-1 items-center text-xs sm:text-sm">
            <p>jan 15, 2024</p>
            <span className="mx-1">·</span>
            <p>5 min read</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default BlogCard