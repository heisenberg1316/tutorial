// Blog.tsx (only relevant parts shown)
import { useParams } from "react-router-dom"
import BlogHeader from "../components/blog/BlogHeader"
import api from "../api/axios"
import { useQuery } from "@tanstack/react-query"
import Spinner from "../components/Spinner"
import BlogContent from "../components/blog/BlogContent"
import BlogTags from "../components/blog/BlogTags"
import DetailsNotFound from "./DetailsNotFound"

export const fetchBlogById = async (id: string) => {
    try {
      const res = await api.get(`/api/v1/blog/${id}`)
      if (!res.data?.blog) throw new Error("Blog not found");
      return res.data;
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err.message ?? "Fetch failed";
      throw new Error(msg);
    }
};

const Blog = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
      queryKey: ["blog", id],
      queryFn: () => fetchBlogById(id!),
      enabled: !!id,
      staleTime: 10 * 60 * 1000,
      retry : 0,
      refetchOnWindowFocus: false,   // <-- avoid refetch when user focuses tab
      refetchOnReconnect: false,     // <-- avoid refetch on network reconnect
      refetchOnMount: false,         // <-- skip refetch when component remounts if cached
  });

  const wordsPerMinute = 200;
  const words = data?.blog.content?.trim().split(/\s+/).length || 0;
  const readTime = Math.ceil(words / wordsPerMinute);

  console.log("error is ", isError);

  if(isError){
      return <DetailsNotFound type="blog" />
  }
  

  return (
    <div className="min-h-screen bg-white -mx-6 mt-0.5">
      {isLoading ? <Spinner /> :
        <>
          <div className="px-4 sm:px-2 lg:px-0">
            <BlogHeader
              email = {data?.blog.author.email}
              title={data?.blog.title}
              name={data?.blog.author.name}
              authorImage = {data?.blog.author.imageLink}
              publishDate={data?.blog.createdAt}
              readTime={readTime}
              upvotes={data?.blog.upvotes}
              likedByUser={data?.likedByUser}
            />
          </div>

          <main className="bg-white  max-w-4xl mx-auto px-2 sm:px-6 px-4">
              <img src={data?.blog.imageLink} className="mt-12 w-full mb-5 object-cover rounded-lg shadow-lg"/>
              <BlogContent content={data?.blog.content} />
              <BlogTags tags={data?.blog.tags} />
              {/* <BlogActions initialLikes={data?.blog.likes} blogId={data?.blog.id} />  */}
              {/* <RelatedPosts posts={relatedPosts} /> */}
          </main>
        </>
      }
    </div>
  )
}

export default Blog
