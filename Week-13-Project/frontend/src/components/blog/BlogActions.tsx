"use client"

import { useState } from "react"
import { FiHeart, FiBookmark, FiShare2, FiMessageCircle } from "react-icons/fi"

interface BlogActionsProps {
  initialLikes: number
}

export default function BlogActions({ initialLikes }: BlogActionsProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1)
      setIsLiked(false)
    } else {
      setLikes(likes + 1)
      setIsLiked(true)
    }
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this blog post',
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="border-t border-gray-200 pt-4 sm:pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isLiked
                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <FiHeart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              <span className="text-sm font-medium">{likes}</span>
            </button>

            <button
              onClick={handleBookmark}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isBookmarked
                  ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <FiBookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
              <span className="text-sm font-medium">Save</span>
            </button>

            <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
              <FiMessageCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Comment</span>
            </button>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FiShare2 className="h-4 w-4" />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      </div>
    </div>
  )
}
