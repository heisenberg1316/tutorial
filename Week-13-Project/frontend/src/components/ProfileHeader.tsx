import React, { useState } from 'react'
import api from '../api/axios';
import type { UserType } from '../types/types';


interface MyProfileData {
  success: true;
  blogs: any[];
}

interface OtherProfileData extends UserType {
  blogs: any[];
}

type ProfileData = MyProfileData | OtherProfileData;


interface HeaderProps {
    type : string
    user ?: UserType | null,
    setUser ?: React.Dispatch<React.SetStateAction<UserType | null>>;
    data : ProfileData;
    editedProfile ?: UserType | null,
    setEditedProfile ?: React.Dispatch<React.SetStateAction<UserType | null>>;
}

const ProfileHeader = ({type, user, setUser, data, editedProfile, setEditedProfile} : HeaderProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const profileImage = type === "my-profile"
        ? user?.imageLink ?? "/images/ProfileAvatar.png"
        : data && 'imageLink' in data
          ? data.imageLink
          : "/images/ProfileAvatar.png";

    const profileName = type === "my-profile" ? user?.name ?? "-" : data && "name" in data ? data.name : "-";

    const profileEmail = type === "my-profile" ? user?.email ?? "-" : data && "email" in data ? data.email : "-";

    const profileBio = type === "my-profile" ? user?.bio ?? "-" : data && "bio" in data ? data.bio : "-";

    const profileBlogsCount = type === "my-profile" ? data?.blogs?.length ?? 0 : data && "blogs" in data ? data.blogs.length : 0;

    const profileViews = type === "my-profile" ? user?.profileViews ?? 0 : data && "profileViews" in data ? data.profileViews : 0;

   console.log("data inside profile header is ", data);

   const handleSaveProfile = async () => {
      // Here you would typically save to an API
      try{
        setIsSubmitting(true);
        let result = await api.post("/api/v1/user/update-profile", editedProfile);
        
        console.log("result is ", result);
        setUser?.((old) => ({
          ...old,
          ...result?.data?.data
        }));

        alert("Profile updated successfully!")
      }
      catch(err : any){
        alert(err?.response?.data?.error);
      }
      finally {
        setIsEditing(false)
        setIsSubmitting(false);
      }
  }

  const joinedAt = new Date(user?.createdAt || "").toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
  })

  return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6 sm:mb-8">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              {/* Profile Image */}
              <div className="flex-shrink-0 self-center sm:self-start">
                <button
                  className="w-15 h-15 rounded-full overflow-hidden"
                  title={user?.name}
                >
                   <img
                    src={profileImage}
                    alt="User avatar"
                    className="w-full h-full object-cover"
                  />


              </button>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    {(isEditing && type=="my-profile") ? (
                      <input
                        type="text"
                        value={editedProfile?.name}
                        maxLength={30}
                        onChange={(e) => setEditedProfile?.((prev) =>
                                      prev
                                        ? { ...prev, name: e.target.value }
                                        : { 
                                            id: "", 
                                            name: e.target.value, 
                                            email: "", 
                                            bio: "", 
                                            imageLink: "", 
                                            createdAt: new Date(), 
                                            profileViews: 0 
                                          }
                                    ) 
                                  }
                        className="w-full text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 border border-gray-300 rounded-md px-2 py-1 mb-2"
                      />
                    ) : (
                      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{profileName}</h1>
                    )}

                    <p className="text-sm sm:text-base text-gray-600 mb-2">{profileEmail}</p>

                    {(isEditing && type=="my-profile")  ? (
                      <textarea
                        value={editedProfile?.bio}
                        onChange={(e) => setEditedProfile?.((prev) =>
                                      prev
                                        ? { ...prev, bio: e.target.value }
                                        : { 
                                            id: "", 
                                            name: "", 
                                            email: "", 
                                            bio: e.target.value, 
                                            imageLink: "", 
                                            createdAt: new Date(), 
                                            profileViews: 0 
                                          }
                                  )}
                        maxLength={200}
                        className="w-full text-sm sm:text-base text-gray-700 border border-gray-300 rounded-md px-2 py-1 mb-4 resize-none"
                        rows={3}
                      />
                    ) : (
                      <p className="text-sm sm:text-base text-gray-700 mb-4 max-w-2xl">{profileBio}</p>
                    )}

                    <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Joined : {joinedAt}
                      </span>
                    </div>
                  </div>

                  { type=="my-profile" && 
                    <div className="flex gap-2 justify-end">
                      {isEditing  ? (
                        <>
                          <button
                              onClick={handleSaveProfile}
                              disabled={isSubmitting}
                              className={` px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white rounded-md transition-colors
                                ${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "cursor-pointer bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"}
                              `}
                            >
                              {isSubmitting ? "Saving..." : "Save"}
                          </button>

                          <button
                            onClick={() => setIsEditing(false)}
                            className="px-3 cursor-pointer py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="cursor-pointer px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        >
                          Edit Profile
                        </button>
                      )}
                    </div>
                  }
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  {profileBlogsCount}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  {profileViews}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Views</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">-</div>
                <div className="text-xs sm:text-sm text-gray-600">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">-</div>
                <div className="text-xs sm:text-sm text-gray-600">Following</div>
              </div>
            </div>
          </div>
        </div>
  )
}

export default ProfileHeader