import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { useState } from "react";
import ShowModal from "./ShowModal";
import { Link, useMatch, useNavigate } from "react-router-dom";
import BgOverlay from "./BgOverlay";
import { useAuth } from "../context/AuthContext";
import DeleteModal from "./DeleteModal";


interface TabsProps {
  activeTab: string; // or "Published" | "Draft" for stricter typing
  setActiveTab: React.Dispatch<React.SetStateAction<"published" | "drafts" | "settings">>;
  data: any; // replace with proper type if available, e.g., UserType
  publishedBlogs: any[]; // replace `any` with BlogType if available
  draftBlogs: any[]; // replace `any` with BlogType if available
}

const Tabs = ({activeTab, setActiveTab, data, publishedBlogs, draftBlogs} : TabsProps) => {
    console.log("data is ", data);
    const queryClient = useQueryClient();
    const [showModal, setShowModal] = useState(false);
    const [blogIdToDelete, setBlogIdToDelete] = useState<string | null>(null);
    const navigate = useNavigate();
    const isMyProfile = useMatch("my-profile");
    const {user, setUser, setIsLoggedIn} = useAuth();
    const [delAccount, setDelAccount] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.delete(`/api/v1/blog/${id}`),
        onSuccess: () => {
          alert("Blog deleted successfully");
          queryClient.invalidateQueries({ queryKey: ["my-blogs"] });
          setBlogIdToDelete(null);
        },
        onError: (err) => {
          console.error("Delete error:", err);
          alert("Failed to delete blog");
          setBlogIdToDelete(null);
        },
    });

    const confirmDeleteBlog = () => {
        if (blogIdToDelete) {
          deleteMutation.mutate(blogIdToDelete);
          setShowModal(false);
        }
    };

    const deleteBlog = (id: string) => {
        setBlogIdToDelete(id);
        setShowModal(true);
    };

    // Usage inside component
    const deleteAccount = async () => {
        if (isDeleting) return;
        try {
          setIsDeleting(true);
          await api.delete("/api/v1/user/delete");

          for (let key in localStorage) {
              if (key.startsWith(`autosave-${user?.email}-`)) {
                  localStorage.removeItem(key);
              }
          }

          // success actions
          setIsLoggedIn(false);
          setUser(null);
          queryClient.clear();
          alert("Profile deleted successfully");
          navigate("/");
        }
        catch (err: any) {
          console.error("err is ", err);
          alert(err?.response?.data?.error || err.message || "Something went wrong");
        }
        finally {
          setIsDeleting(false);
        }
    };


    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {showModal && <BgOverlay />}
          {showModal && <ShowModal setShowModal={setShowModal} handleDelete={confirmDeleteBlog} page={"my-profile"} />}
          {delAccount && <BgOverlay />}
          {delAccount && <DeleteModal setDelAccount={setDelAccount} handleDelete={deleteAccount} isDeleting={isDeleting}/>}
          <div className="border-b border-gray-200">
            {/* nav bar */}
            <nav className="flex space-x-8 px-4 sm:px-6 overflow-auto" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("published")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "published"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Published ({publishedBlogs?.length})
              </button>
              <button
                onClick={() => setActiveTab("drafts")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "drafts"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Drafts ({draftBlogs?.length})
              </button>
              {
                (isMyProfile) && 
                <button
                onClick={() => setActiveTab("settings")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "settings"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  >
                  Settings
                </button>
              }
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {/* Published Blogs Tab */}
            {activeTab === "published" && (
              <div className="space-y-4">
                {publishedBlogs?.length === 0 ? (
                  <div className="text-center py-12">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-gray-500 text-lg">No published posts yet</p>
                    {isMyProfile && 
                      <Link
                      to="/createblog"
                      className="mt-4 inline-block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Create Your First Post
                      </Link>
                    }
                  </div>
                ) : (
                  <div className="grid gap-4 sm:gap-6">
                    {publishedBlogs?.map((blog) => (
                      <Link to={`/blog/${blog.id}`}
                        key={blog.id}
                      
                        className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{blog.title}</h3>
                            <p className="text-sm sm:text-base text-gray-600 mb-3 line-clamp-2">{blog.description}</p>

                            <div className="flex flex-wrap gap-1 mb-3">
                              {console.log("tags is ", blog.tags)}
                                {blog.tags?.slice(0, 5)?.map((tagObj : {name : string}) => (
                                  
                                    <span
                                    key={tagObj.name}
                                    className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md"
                                    >
                                    {tagObj.name}
                                    </span>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-gray-500">
                              <span>Published : {new Date(blog.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })}</span>
                              {/* <span>views {blog.views}</span> */}
                              <span>upvotes {blog.upvotes}</span>
                            </div>
                          </div>

                          {(isMyProfile) && 
                            <div className="flex gap-2 flex-shrink-0">
                                  <button onClick={(e) => { 
                                    e.preventDefault();
                                    navigate(`/editblog/${blog.id}`)
                                    }} className="px-3 py-1.5 text-xs cursor-pointer font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                                    Edit
                                  </button>
                                  <button  onClick={(e) => {
                                    e.preventDefault(); // stop Link navigation
                                    deleteBlog(blog.id);
                                  }} className="px-3 py-1.5 text-xs cursor-pointer font-medium text-black bg-white border border-red-300 rounded-md hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors">
                                    Delete
                                  </button>
                            </div>
                          }
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Drafts Tab */}
            {activeTab === "drafts" && (
              <div className="space-y-4">
                {draftBlogs?.length === 0 ? (
                  <div className="text-center py-12">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    <p className="text-gray-500 text-lg">No drafts saved</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:gap-6">
                    {draftBlogs?.map((blog) => (
                      <Link to={`/blog/${blog.id}`}
                        key={blog.id}
                        className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-yellow-50 border-yellow-200"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{blog.title}</h3>
                              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-md">
                                Draft
                              </span>
                            </div>
                            <p className="text-sm sm:text-base text-gray-600 mb-3 line-clamp-2">{blog.description}</p>

                            <div className="flex flex-wrap gap-1 mb-3">
                                {blog.tags?.slice(0, 5)?.map((tagObj : {name : string}) => (
                                    <span
                                    key={tagObj.name}
                                    className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md"
                                    >
                                    {tagObj.name}
                                    </span>
                                ))}
                            </div>


                            <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-gray-500">
                              <span>Published : {new Date(blog.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })}</span>
                              {/* <span>views {blog.views}</span> */}
                              <span>upvotes {blog.upvotes}</span>
                            </div>
                          </div>

                           {
                            (isMyProfile) && 
                                <div className="flex gap-2 flex-shrink-0">
                                  <button onClick={(e) => { 
                                    e.preventDefault();
                                    navigate(`/editblog/${blog.id}`)
                                  }} className="px-3 py-1.5 text-xs cursor-pointer font-medium text-white bg-blue-600 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                                    Continue Writing
                                  </button>
                                  <button  onClick={(e) => {
                                    e.preventDefault(); // stop Link navigation
                                            deleteBlog(blog.id);
                                          }} className="px-3 py-1.5 text-xs cursor-pointer font-medium text-black bg-white border border-red-300 rounded-md hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors">
                                    Delete
                                  </button>
                                </div>
                            }
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {(activeTab === "settings") && (
              <div className="space-y-6">
                {/* <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Notifications</label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            defaultChecked
                          />
                          <span className="ml-2 text-sm text-gray-600">New followers</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            defaultChecked
                          />
                          <span className="ml-2 text-sm text-gray-600">Comments on my posts</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-600">Weekly digest</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Privacy</label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            defaultChecked
                          />
                          <span className="ml-2 text-sm text-gray-600">Make my profile public</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            defaultChecked
                          />
                          <span className="ml-2 text-sm text-gray-600">Allow others to see my reading list</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div> */}

                <div className="">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Danger Zone</h3>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-red-800 mb-2">Delete Account</h4>
                    <p className="text-sm text-red-600 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button onClick={() => {
                      setDelAccount(!delAccount);
                    }} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
  )
}

export default Tabs