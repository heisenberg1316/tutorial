// Blog.tsx (only relevant parts shown)
import { useParams } from "react-router-dom";
import BlogHeader from "../components/blog/BlogHeader";
import api from "../api/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Spinner from "../components/Spinner";
import BlogContent from "../components/blog/BlogContent";
import BlogTags from "../components/blog/BlogTags";
import DetailsNotFound from "./DetailsNotFound";
import BlogComments from "../components/blog/BlogComments";
import BlogActions from "../components/blog/BlogActions";
import { useEffect, useState } from "react";

export const fetchBlogById = async (id: string) => {
  const res = await api.get(`/api/v1/blog/${id}`);
  console.log("res is ", res);
  if (!res.data?.blog) throw new Error("Blog not found");
  return res.data;
};

const Blog = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => fetchBlogById(id!),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  // Lifted state
  const [liked, setLiked] = useState<boolean>(data?.likedByUser ?? false);
  const [upvotesCount, setUpvotesCount] = useState<number>(data?.blog?.upvotes ?? 0);

  // Sync when query data changes (on initial load or server push)
  useEffect(() => {
    if (data) {
      setLiked(!!data.likedByUser);
      setUpvotesCount(data.blog.upvotes);
    }
  }, [data]);

  // Optimistic mutation in parent
  const mutation = useMutation({
    mutationFn: async (blogId: string) => {
      return api.put("/api/v1/blog/upvotes", { id: blogId });
    },
    onMutate: async (blogId: string) => {
      if (!blogId) return;

      await queryClient.cancelQueries({ queryKey: ["blog", blogId] });

      const previous = queryClient.getQueryData(["blog", blogId]);

      // Optimistically update React Query cache
      queryClient.setQueryData(["blog", blogId], (old: any) => {
        if (!old) return old;

        const currentlyLiked = !!old.likedByUser;
        const delta = currentlyLiked ? -1 : 1;

        if (old.blog) {
          return {
            ...old,
            likedByUser: !currentlyLiked,
            blog: {
              ...old.blog,
              upvotes: old.blog.upvotes + delta,
            },
          };
        }

        return {
          ...old,
          likedByUser: !currentlyLiked,
          upvotes: (old.upvotes ?? 0) + delta,
        };
      });

      // Update parent local state (so children reflect immediately)
      setLiked(prev => !prev);
      setUpvotesCount(prev => prev + (prev ? -1 : 1)); // prev is old liked

      return { previous };
    },
    onError: (_err, blogId, ctx: any) => {
      // rollback cache and local UI on error
      if (ctx?.previous) {
        queryClient.setQueryData(["blog", blogId], ctx.previous);
        // restore parent state from previous
        const prev = ctx.previous;
        setLiked(!!prev.likedByUser);
        const prevUp = prev.blog ? prev.blog.upvotes : prev.upvotes ?? 0;
        setUpvotesCount(prevUp);
      }
    },
    // we don't refetch here (you can if you want server truth)
  });

  const handleLike = () => {
    if (!id) return;
    mutation.mutate(id);
  };

  if (isError) return <DetailsNotFound type="blog" />;
  if (isLoading) return <Spinner />;

  const wordsPerMinute = 200;
  const words = data?.blog.content?.trim().split(/\s+/).length || 0;
  const readTime = Math.ceil(words / wordsPerMinute);

  return (
    <div className="min-h-screen bg-white -mx-6 mt-0.5">
      <div className="px-4 sm:px-2 lg:px-0">
        <BlogHeader
          email={data?.blog.author.email}
          title={data?.blog.title}
          name={data?.blog.author.name}
          authorImage={data?.blog.author.imageLink}
          publishDate={data?.blog.createdAt}
          readTime={readTime}
          upvotes={upvotesCount}
          likedByUser={liked}
          handleLike={handleLike}         // pass handler down
        />
      </div>

      <main className="bg-white  max-w-4xl mx-auto px-4">
        <img src={data?.blog.imageLink} className="mt-12 w-full mb-5 object-cover rounded-lg shadow-lg" />
        <BlogContent content={data?.blog.content} />
        <BlogTags tags={data?.blog.tags} />
        <BlogActions
          upvotes={upvotesCount}
          likedByUser={liked}
          handleLike={handleLike}         // same handler here
        />
        <BlogComments blogId={data?.blog.id} comments={data?.blog.comments} />
      </main>
    </div>
  );
};

export default Blog;
