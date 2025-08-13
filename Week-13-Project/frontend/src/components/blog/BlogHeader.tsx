
import { FiCalendar, FiClock, FiHeart } from "react-icons/fi"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../../api/axios"
import { useNavigate, useParams } from "react-router-dom"

interface BlogHeaderProps {
  email : string
  title: string
  name: string
  authorImage : string
  publishDate: string
  readTime: number
  upvotes : number
  likedByUser : boolean
}

interface BlogData {
  author: { name: string; email: string; imageLink: string };
  content: string;
  createdAt: string;
  id: string;
  imageLink: string;
  tags: any[];
  title: string;
  upvotes: number;
}

interface BlogCache {
  blog: BlogData;
  likedByUser: boolean;
}

export function dateConverter(publishDate: string | number | Date){
  return  new Date(publishDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default function BlogHeader({
  email,
  title,
  name,
  authorImage,
  publishDate,
  readTime,
  upvotes,
  likedByUser,
}: BlogHeaderProps) {

  publishDate = dateConverter(publishDate);

  const [upvotesCount, setUpvotesCount] = useState(upvotes);
  const [liked, setLiked] = useState(likedByUser);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();

  const mutation = useMutation({
    mutationFn: async (blogId: string) => {
      // send backend toggle request
      return api.put("api/v1/blog/upvotes", { id: blogId });
    },

    onMutate: async (blogId: string) => {
      if (!blogId) return;

      // 1) cancel any outgoing fetches for this blog to avoid stomping optimistic update
      await queryClient.cancelQueries({ queryKey: ["blog", blogId] });

      // 2) snapshot previous cache for rollback
      const previous = queryClient.getQueryData<BlogCache>(["blog", blogId]);
      console.log("previous is ", previous);

      // 3) update cache optimistically (handle both shapes: { blog: {...} } or flat)
      queryClient.setQueryData(["blog", blogId], (old: any) => {
        if (!old) return old;

        // determine current liked state in cache
        const isLiked = !!old.likedByUser;

        // if data is nested under old.blog
        if (old.blog) {
          return {
            ...old,
            blog: {
              ...old.blog,
              upvotes: isLiked ? old.blog.upvotes - 1 : old.blog.upvotes + 1,
            },
            likedByUser: !isLiked,
          };
        }

        // flat shape
        return {
          ...old,
          upvotes: isLiked ? old.upvotes - 1 : old.upvotes + 1,
          likedByUser: !isLiked,
        };
      });

      // 4) update local component UI from the previous snapshot (guarantees correct delta)
      if (previous) {
        const isLikedPrev = !!previous.likedByUser;
        setLiked(!isLikedPrev);
        const prevUpvotes = previous.blog.upvotes
        setUpvotesCount(isLikedPrev ? prevUpvotes - 1 : prevUpvotes + 1);
      } else {
        // fallback: toggle local
        setLiked(prev => !prev);
        setUpvotesCount(prev => prev + (liked ? -1 : 1));
      }

      return { previous };
    },

    onError: (_err, blogId, ctx: any) => {
      // rollback cache and local UI if error
      if (ctx?.previous) {
        queryClient.setQueryData(["blog", blogId], ctx.previous);
        const prev = ctx.previous;
        const prevLiked = !!prev.likedByUser;
        setLiked(prevLiked);
        const prevUp = prev.blog ? prev.blog.upvotes : prev.upvotes;
        setUpvotesCount(prevUp);
      }
    },

    // we intentionally do not invalidate/refetch on success because you said "no refetch".
    // If you want to verify server truth later, you can call invalidateQueries here.
  });

  const handleLike = () => {
    if (!id) return;
    mutation.mutate(id);
  };

  return (
    <header className=" max-w-4xl mx-auto  border-b border-gray-200">
      <div>
        <div className="mx-auto px-2 sm:px-2 lg:px-6 pt-10 pb-6 ">
          <h1 className="text-3xl lg:text-4xl font-bold font-sans text-gray-900 sm:mb-8 mb-4">{title}</h1>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <img onClick={() => navigate(`/user/${email}`)} src={authorImage} alt={name} className="w-12 h-12 rounded-full object-cover cursor-pointer" />
              </div>

              <div className="flex flex-col text-xs sm:text-sm text-gray-500">
                <div>
                  <span className="text-sm sm:text-base font-medium text-gray-900">{name}</span>
                </div>
                <span className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <FiCalendar className="h-3 w-3 sm:h-4 sm:w-4" />
                    {publishDate}
                  </div>
                  <div className="flex items-center gap-1">
                    <FiClock className="h-3 w-3 sm:h-4 sm:w-4" />
                    {readTime} minutes read
                  </div>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 text-lg mt-0.5  sm:text-sm text-gray-500 select-none">
              <span className="flex items-center gap-2">
                <FiHeart
                  onClick={handleLike}
                  className={`h-5 w-5 sm:h-7 sm:w-7 cursor-pointer transition-all duration-200 ${liked ? "text-red-500 scale-110" : "text-gray-500"}`}
                />
                {upvotesCount} upvotes
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
