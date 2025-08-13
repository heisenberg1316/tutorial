import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FiFilter } from "react-icons/fi";

import api from "../api/axios";
import BlogCard from "../components/BlogCard";
import BlogCardSkeleton from "../components/BlogCardSkeleton";
import Stickybar from "../components/Stickybar";
import FilterDrawer from "../components/FilterDrawer";
import { useFilter } from "../context/FilterContext";

const LIMIT = 9;

const fetchBlogs = async ({ pageParam = null, queryKey }: any) => {
  // queryKey = ['blogs', finalQuery, finalTags]
  const [, finalQuery, finalTags] = queryKey as [string, string, string[]];

  const params: any = {
    cursor: pageParam,
    limit: LIMIT,
  };

  if (finalQuery) params.query = finalQuery;
  if (finalTags && finalTags.length > 0) params.tags = finalTags.join(",");

  const res = await api.get("/api/v1/blog/bulk", { params });
  return res.data;
};

const Blogs = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const { finalTags, finalQuery } = useFilter();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["blogs", finalQuery, finalTags],
    queryFn: fetchBlogs,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    initialPageParam: null,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  // Flatten all pages into one array
  const allBlogs = useMemo(
    () => data?.pages.flatMap((page) => page.blogs) || [],
    [data]
  );

  // How many skeletons to show for the next page
  const lastPageCount =
    data?.pages[data.pages.length - 1]?.blogs.length ?? LIMIT;

  // IntersectionObserver to trigger fetchNextPage
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [fetchNextPage, hasNextPage]);

  // optional: scroll to top when applied filters change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [finalTags, finalQuery]);

  return (
    <div className={`w-full pt-5 ${drawerOpen ? "overflow-hidden h-[90vh]" : ""}`}>
      {/* Mobile filter button */}
      <div className="w-full lg:hidden mb-4">
        <button
          onClick={() => setDrawerOpen(true)}
          className="w-full border py-1 rounded-md border-neutral-300 hover:bg-gray-100"
        >
          <div className="flex items-center gap-3 justify-center">
            <FiFilter />
            <span className="font-medium">Filters</span>
          </div>
        </button>
      </div>

      <div className="flex gap-8">
        {/* Main Blogs Column */}
        <div className="w-full">
          <div className="flex flex-col gap-1 mb-4">
            <h2 className="font-bold text-lg sm:text-xl lg:text-2xl">Blogs</h2>
            <p>{allBlogs.length} posts found</p>
          </div>

          {/* GRID: initial-load skeletons OR real cards + next-page skeletons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {isLoading
              ? // Initial load: show full grid of 6 skeletons
                Array.from({ length: LIMIT }).map((_, i) => (
                  <div key={`initial-${i}`} className="w-full h-full">
                    <BlogCardSkeleton />
                  </div>
                ))
              : // Already-loaded real blogs
                allBlogs.map((blog: any) => (
                  <Link
                    to={`/blog/${blog.id}`}
                    key={blog.id}
                    className="w-full h-full"
                  >
                    <BlogCard blog={blog} />
                  </Link>
                ))}

            {/* Append shimmer placeholders while fetching next page */}
            {!isLoading &&
              isFetchingNextPage &&
              Array.from({ length: lastPageCount }).map((_, i) => (
                <div key={`next-${i}`} className="w-full h-full">
                  <BlogCardSkeleton />
                </div>
              ))}
          </div>

          {/* Footer sentinel & messaging */}
          <div ref={loaderRef} className="text-center py-4">
            {!isFetchingNextPage &&
              (hasNextPage ? "Scroll down to load more" : "No more blogs")}
          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block relative">
          <Stickybar />
        </div>

        {/* Backdrop for mobile drawer */}
        {drawerOpen && (
          <div
            className="fixed inset-0 z-40 bg-black opacity-80 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
        )}

        {/* Mobile filter drawer */}
        <FilterDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </div>
    </div>
  );
};

export default Blogs;
