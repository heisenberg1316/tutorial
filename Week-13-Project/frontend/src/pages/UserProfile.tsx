import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import api from "../api/axios"
import { useQuery } from "@tanstack/react-query"
import Tabs from "../components/Tabs"
import Shimmer from "../components/Shimmer"
import ProfileHeader from "../components/ProfileHeader"
import { useNavigate, useParams } from "react-router-dom"
import DetailsNotFound from "./DetailsNotFound"

export const fetchUserDetails = async (email, user) => {
    if(email==user.email) return;

    const res = await api.post('/api/v1/user/details', {email});
    console.log("res is ", res);
    return res.data;
};

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState<"published" | "drafts">("published")
  const navigate = useNavigate();
  const {email} = useParams<{ email: string }>();
  const {user, setUser} = useAuth();
  const [editedProfile, setEditedProfile] = useState(user)


  
  useEffect(() => {
      if(email==user.email) navigate("/my-profile")
  }, [])


  const { data, isLoading, isError, error } = useQuery({
      queryKey: [`user`, email],
      queryFn: () => fetchUserDetails(email, user),
      staleTime: 10 * 60 * 1000, // optional caching
      retry : 0,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
  });

  const publishedBlogs = data?.data?.blogs?.filter(b => b.published) ?? []
  const draftBlogs = data?.data?.blogs?.filter(b => b.published==false) ?? []

  if(isError){
    return <DetailsNotFound type="user" />
  }


  return (
    <div className="min-h-screen bg-gray-50 mt-0.5">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Profile Header */}
        <ProfileHeader type="user-profile" user={user} setUser={setUser} data={data} editedProfile={editedProfile} setEditedProfile={setEditedProfile}/>

        {/* Tabs */}
        {isLoading
          ?  <Shimmer />
          : <Tabs activeTab={activeTab} setActiveTab={setActiveTab} data={data} publishedBlogs={publishedBlogs} draftBlogs={draftBlogs}/>
        }
      </div>
    </div>
  )
}
