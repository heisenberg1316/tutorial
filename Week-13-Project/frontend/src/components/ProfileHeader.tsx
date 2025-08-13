import React, { useState } from 'react'
import api from '../api/axios';
import type { UserType } from '../types/types';

interface HeaderProps {
    type : string
    user ?: UserType,
    setUser ?: React.Dispatch<React.SetStateAction<UserType>>;
    data : object;
    editedProfile ?: UserType,
    setEditedProfile ?: React.Dispatch<React.SetStateAction<UserType>>;
}

const ProfileHeader = ({type, user, setUser, data, editedProfile, setEditedProfile} : HeaderProps) => {
   const [isEditing, setIsEditing] = useState(false)
   const [isSubmitting, setIsSubmitting] = useState(false);

   const handleSaveProfile = async () => {
      // Here you would typically save to an API
      try{
        setIsSubmitting(true);
        let result = await api.post("/api/v1/user/update-profile", editedProfile);
        
        console.log("result is ", result);
        setUser((old : UserType) => ({
          ...old,
          ...result?.data?.data
        }));

        alert("Profile updated successfully!")
      }
      catch(err){
        alert(err?.response?.data?.error);
      }
      finally {
        setIsEditing(false)
        setIsSubmitting(false);
      }
  }

  const joinedAt = new Date(user.createdAt).toLocaleDateString("en-GB", {
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
                      src={ (type === "my-profile" ? user?.imageLink : data?.data?.imageLink) || "/images/ProfileAvatar.png"}
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
                        value={editedProfile.name}
                        maxLength={30}
                        onChange={(e) => setEditedProfile((prev) => ({ ...prev, name: e.target.value }))}
                        className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 border border-gray-300 rounded-md px-2 py-1 mb-2"
                      />
                    ) : (
                      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{type=="my-profile" ? user.name : data?.data.name}</h1>
                    )}

                    <p className="text-sm sm:text-base text-gray-600 mb-2">{type=="my-profile" ? user.email : data?.data.email}</p>

                    {(isEditing && type=="my-profile")  ? (
                      <textarea
                        value={editedProfile.bio}
                        onChange={(e) => setEditedProfile((prev) => ({ ...prev, bio: e.target.value }))} maxLength={200}
                        className="w-full text-sm sm:text-base text-gray-700 border border-gray-300 rounded-md px-2 py-1 mb-4 resize-none"
                        rows={3}
                      />
                    ) : (
                      <p className="text-sm sm:text-base text-gray-500 font-semibold mb-4 max-w-2xl">{type=="my-profile" ? user.bio : data?.data.bio}</p>
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
                  {type=="my-profile" ? data?.blogs.length : data?.data?.blogs.length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  {type=="my-profile" ? user?.profileViews : data?.data?.profileViews}
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