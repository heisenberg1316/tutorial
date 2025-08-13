import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import api from "../api/axios"
import { useQuery } from "@tanstack/react-query"
import Tabs from "../components/Tabs"
import Shimmer from "../components/Shimmer"
import ProfileHeader from "../components/ProfileHeader"

export const fetchMyBlogs = async () => {
    const res = await api.post('/api/v1/user/my-blogs');
    console.log("res is ", res);
    return res.data;
};

export default function MyProfile() {
  const [activeTab, setActiveTab] = useState<"published" | "drafts" | "settings">("published")
 
  const {user, setUser} = useAuth();
  const [editedProfile, setEditedProfile] = useState(user)

  const { data, isLoading } = useQuery({
    queryKey: ['my-blogs'],
    queryFn: fetchMyBlogs,
    staleTime: 10 * 60 * 1000, // optional caching
  });

  const publishedBlogs = data?.blogs?.filter((b : any) => b.published) ?? []
  const draftBlogs = data?.blogs?.filter((b : any) => b.published==false) ?? []


  return (
    <div className="min-h-screen bg-gray-50 mt-0.5">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Profile Header */}
        <ProfileHeader type="my-profile" user={user} setUser={setUser} data={data} editedProfile={editedProfile} setEditedProfile={setEditedProfile}/>

        {/* Tabs */}
        {isLoading
          ?  <Shimmer />
          : <Tabs activeTab={activeTab} setActiveTab={setActiveTab} data={data} publishedBlogs={publishedBlogs} draftBlogs={draftBlogs}/>
        }
      </div>
    </div>
  )
}
