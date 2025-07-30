import { FiFilter } from "react-icons/fi"
import BlogCard from "../components/BlogCard"
import Stickybar from "../components/Stickybar"
import FilterDrawer from "../components/FilterDrawer"
import { useState } from "react"

const Blogs = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <div className={`w-full pt-5 ${drawerOpen ? "overflow-hidden h-[90vh]" : ""}`}>
            {/* filter button for smaller devices */}
            <div className="w-full lg:hidden mb-4">
                <button onClick={() => setDrawerOpen(true)}  className="w-full border-1 py-1 rounded-md border-neutral-300 hover:bg-gray-100 cursor-pointer">
                    <div className="flex items-center gap-3 justify-center">
                        <FiFilter />
                        <span className="font-medium">Filters {}</span>
                    </div>
                </button>
            </div>
            {/*blogs section using grid with sticky bar*/}
            <div className="flex gap-8">
                <div>
                    <div className="flex flex-col gap-1 mb-4">
                        <h2 className="font-bold text-lg sm:text-xl lg:text-2xl">Blogs </h2>
                        <p>4 posts found</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <BlogCard />
                        <BlogCard />
                        <BlogCard />
                        <BlogCard />
                        <BlogCard />
                        <BlogCard />
                        <BlogCard />
                        <BlogCard />
                    </div>
                </div>


                {/* sticky bar */}
                <div className="hidden lg:block relative">
                    <Stickybar />
                </div>

                {/* backdrop overlay */}
                {drawerOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black opacity-80 backdrop-blur-sm transition-opacity duration-300"
                    onClick={() => setDrawerOpen(false)}
                />
                )}
                
                {/* filter drawer */}
                <FilterDrawer
                    isOpen={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                />
            </div>

            
        </div>
    )
}

export default Blogs