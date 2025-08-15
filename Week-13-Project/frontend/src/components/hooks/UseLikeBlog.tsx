// hooks/useLikeBlog.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import api from "../../api/axios";

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

export function useLikeBlog(initialUpvotes: number, initialLiked: boolean, blogId?: string) {
  const queryClient = useQueryClient();
  const [upvotesCount, setUpvotesCount] = useState(initialUpvotes);
  const [liked, setLiked] = useState(initialLiked);

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      return api.put("api/v1/blog/upvotes", { id });
    },
    onMutate: async (id: string) => {
      if (!id) return;

      await queryClient.cancelQueries({ queryKey: ["blog", id] });
      const previous = queryClient.getQueryData<BlogCache>(["blog", id]);

      queryClient.setQueryData(["blog", id], (old: any) => {
        if (!old) return old;
        const isLiked = !!old.likedByUser;

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

        return {
          ...old,
          upvotes: isLiked ? old.upvotes - 1 : old.upvotes + 1,
          likedByUser: !isLiked,
        };
      });

      if (previous) {
        const isLikedPrev = !!previous.likedByUser;
        setLiked(!isLikedPrev);
        const prevUpvotes = previous.blog.upvotes;
        setUpvotesCount(isLikedPrev ? prevUpvotes - 1 : prevUpvotes + 1);
      } else {
        setLiked(prev => !prev);
        setUpvotesCount(prev => prev + (liked ? -1 : 1));
      }

      return { previous };
    },
    onError: (_err, id, ctx: any) => {
      if (ctx?.previous) {
        queryClient.setQueryData(["blog", id], ctx.previous);
        const prev = ctx.previous;
        const prevLiked = !!prev.likedByUser;
        setLiked(prevLiked);
        const prevUp = prev.blog ? prev.blog.upvotes : prev.upvotes;
        setUpvotesCount(prevUp);
      }
    },
  });

  const handleLike = () => {
    if (!blogId) return;
    mutation.mutate(blogId);
  };

  return { upvotesCount, liked, handleLike };
}
