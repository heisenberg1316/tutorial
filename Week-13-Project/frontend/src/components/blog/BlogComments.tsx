"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../../api/axios"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"

interface Details {
  id: string
  name: string
  imageLink: string
  email?: string
}

interface Comment {
  id: string
  content: string
  createdAt: string
  author: Details
  likedByUser?: boolean
  likesCount?: number
}

interface BlogCommentsProps {
  blogId: string
  comments: Comment[] // initial server-provided comments (from parent)
}

export default function BlogComments({ blogId, comments }: BlogCommentsProps) {
  const [newComment, setNewComment] = useState("")
  const [isPosting, setIsPosting] = useState(false)

  // track currently editing comment id and its draft content
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState<string>("")

  // track which comment is being saved/deleted for per-item loading UI
  const [editingSavingId, setEditingSavingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // POST comment mutation (kept as before)
  const postCommentMutation = useMutation({
      mutationFn: async (payload: { blogId: string; content: string }) => {
        const res = await api.post(`/api/v1/blog/${payload.blogId}/comments`, { content: payload.content })
        return res.data
      },
      onMutate: async ({ blogId, content }) => {
        await queryClient.cancelQueries({ queryKey: ["blog", blogId] })
        const previous = queryClient.getQueryData<any>(["blog", blogId])
        const optimisticComment: Comment = {
          id: `temp-${Date.now()}`,
          content,
          createdAt: new Date().toISOString(),
          author: {
            id: user?.id ?? "me",
            name: user?.name ?? "You",
            imageLink: user?.imageLink ?? "/placeholder.svg",
          },
          likedByUser: false,
          likesCount: 0,
        }
        queryClient.setQueryData(["blog", blogId], (old: any) => {
          if (!old) return old
          const newBlog = { ...old.blog, comments: [optimisticComment, ...(old.blog?.comments || [])] }
          return { ...old, blog: newBlog }
        })
        return { previous, optimisticId: optimisticComment.id }
      },
      onError: (_err, vars, context: any) => {
        if (context?.previous) queryClient.setQueryData(["blog", vars.blogId], context.previous)
      },
      onSuccess: (data, vars, context: any) => {
        const serverComment = data?.comment
        if (!serverComment) {
          queryClient.invalidateQueries({ queryKey: ["blog", vars.blogId] })
          return
        }
        queryClient.setQueryData(["blog", vars.blogId], (old: any) => {
          if (!old) return old
          const existing = old.blog?.comments || []
          const withoutOptimistic = existing.filter((c: any) => c.id !== context?.optimisticId)
          return { ...old, blog: { ...old.blog, comments: [serverComment, ...withoutOptimistic] } }
        })
      },
  })

  // toggle like mutation (kept as before)
  const toggleLikeMutation = useMutation({
      mutationFn: async (commentId: string) => {
        const res = await api.post(`/api/v1/blog/comments/${commentId}/like`)
        return res.data
      },
      onMutate: async (commentId: string) => {
        await queryClient.cancelQueries({ queryKey: ["blog", blogId] })
        const previous = queryClient.getQueryData<any>(["blog", blogId])
        queryClient.setQueryData(["blog", blogId], (old: any) => {
          if (!old) return old
          const updatedComments = (old.blog?.comments || []).map((c: any) => {
            if (c.id !== commentId) return c
            const currentlyLiked = !!c.likedByUser
            return { ...c, likedByUser: !currentlyLiked, likesCount: (c.likesCount ?? 0) + (currentlyLiked ? -1 : 1) }
          })
          return { ...old, blog: { ...old.blog, comments: updatedComments } }
        })
        return { previous }
      },
      onError: (_err, commentId, context: any) => {
        if (context?.previous) queryClient.setQueryData(["blog", blogId], context.previous)
      },
      onSuccess: (data) => {
        const payload = data // { id, likesCount, likedByUser }
        queryClient.setQueryData(["blog", blogId], (old: any) => {
          if (!old) return old
          const updatedComments = (old.blog?.comments || []).map((c: any) =>
            c.id === payload.id ? { ...c, likesCount: payload.likesCount, likedByUser: payload.likedByUser } : c
          )
          return { ...old, blog: { ...old.blog, comments: updatedComments } }
        })
      },
  })

  // EDIT comment mutation (optimistic)
  const editCommentMutation = useMutation({
    mutationFn: async (payload: { commentId: string; content: string }) => {
      const res = await api.put(`/api/v1/blog/comments/${payload.commentId}`, { content: payload.content })
      return res.data // expect { success: true, comment: { ... } }
    },
    onMutate: async ({ commentId, content }) => {
      await queryClient.cancelQueries({ queryKey: ["blog", blogId] })
      const previous = queryClient.getQueryData<any>(["blog", blogId])
      // optimistic update: set comment content and maybe edited flag
      queryClient.setQueryData(["blog", blogId], (old: any) => {
        if (!old) return old
        const updatedComments = (old.blog?.comments || []).map((c: any) =>
          c.id === commentId ? { ...c, content, edited: true, editedAt: new Date().toISOString() } : c
        )
        return { ...old, blog: { ...old.blog, comments: updatedComments } }
      })
      return { previous }
    },
    onError: (_err, vars, context: any) => {
      if (context?.previous) queryClient.setQueryData(["blog", blogId], context.previous)
    },
    onSuccess: (data) => {
      const updatedComment = data?.comment
      if (!updatedComment) {
        queryClient.invalidateQueries({ queryKey: ["blog", blogId] })
        return
      }
      queryClient.setQueryData(["blog", blogId], (old: any) => {
        if (!old) return old
        const updatedComments = (old.blog?.comments || []).map((c: any) =>
          c.id === updatedComment.id ? updatedComment : c
        )
        return { ...old, blog: { ...old.blog, comments: updatedComments } }
      })
    },
  })

  // DELETE comment mutation (optimistic)
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const res = await api.delete(`/api/v1/blog/comments/${commentId}`)
      return res.data // expect success
    },
    onMutate: async (commentId: string) => {
      await queryClient.cancelQueries({ queryKey: ["blog", blogId] })
      const previous = queryClient.getQueryData<any>(["blog", blogId])
      queryClient.setQueryData(["blog", blogId], (old: any) => {
        if (!old) return old
        const filtered = (old.blog?.comments || []).filter((c: any) => c.id !== commentId)
        return { ...old, blog: { ...old.blog, comments: filtered } }
      })
      return { previous }
    },
    onError: (_err, commentId, context: any) => {
      if (context?.previous) queryClient.setQueryData(["blog", blogId], context.previous)
    },
    onSuccess: () => {
      // nothing else — cache already updated
    },
  })

  // Handlers
  const handleSubmitComment = async (e: React.FormEvent) => {
    try {
      setIsPosting(true)
      e.preventDefault()
      const content = newComment.trim()
      if (!content) return
      await postCommentMutation.mutateAsync({ blogId, content })
      setNewComment("")
    } catch (err) {
      console.error(err)
      alert("some error occurred")
    } finally {
      setIsPosting(false)
    }
  }

  const handleLikeComment = (commentId: string) => {
    toggleLikeMutation.mutate(commentId)
  }

  // start editing: set editingId and initialize editingText
  const startEditing = (comment: Comment) => {
    setEditingId(comment.id)
    setEditingText(comment.content)
  }

  // cancel editing
  const cancelEditing = () => {
    setEditingId(null)
    setEditingText("")
  }

  // save edited comment
  const saveEdit = async (commentId: string) => {
    if (!editingText.trim()) return
    try {
      setEditingSavingId(commentId)
      await editCommentMutation.mutateAsync({ commentId, content: editingText.trim() })
      setEditingId(null)
      setEditingText("")
    } catch (err) {
      console.error(err)
      alert("Failed to save edit")
    } finally {
      setEditingSavingId(null)
    }
  }

  // delete comment
  const deleteComment = async (commentId: string) => {
    if (!confirm("Delete this comment?")) return
    try {
      setDeletingId(commentId)
      await deleteCommentMutation.mutateAsync(commentId)
    } catch (err) {
      console.error(err)
      alert("Failed to delete comment")
    } finally {
      setDeletingId(null)
    }
  }

  // Use the comments passed from parent (which come from the query cache)
  const visibleComments = comments || []

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-2 py-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Comments ({visibleComments.length})</h3>
          <p className="text-gray-600">Join the conversation and share your thoughts!</p>
        </div>

        {/* Form */}
        <div className="px-8 py-6 border-b border-gray-100">
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div className="flex items-start space-x-4">
              <img src={user?.imageLink ?? "/placeholder.svg"} alt="Your avatar" className="w-10 h-10 rounded-full border-2 border-blue-100" />
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!newComment.trim() || isPosting}
                className="px-6 py-2.5 bg-blue-600 cursor-pointer text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isPosting ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </form>
        </div>

        {/* List */}
        <div className="px-8 py-6">
          {visibleComments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No comments yet</h4>
              <p className="text-gray-600">Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {visibleComments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-4">
                  <img
                    onClick={() => {
                      if (comment.author.id == user?.id) navigate("/my-profile")
                      else navigate(`/user/${(comment.author as any).email ?? comment.author.id}`)
                    }}
                    src={comment.author.imageLink || "/placeholder.svg"}
                    alt={comment.author.name}
                    className="w-12 h-12 cursor-pointer rounded-full border-2 border-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                  {/* Responsive comment card */}
            <div className="bg-gray-50 rounded-2xl px-4 py-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                {/* author + time */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{comment.author.name}</h4>
                    <span className="text-xs sm:text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                    {comment?.edited && (
                      <span className="text-xs sm:text-sm font-medium text-gray-500">(Edited)</span>
                    )}
                  </div>
                </div>

          {/* Action buttons: inline on sm+; collapsible on mobile */}
          <div className="flex items-center">
            {/* Desktop / tablet: visible on sm+ */}
            {comment.author.id === user?.id && editingId !== comment.id && (
              <div className=" sm:flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    startEditing(comment)
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  Edit
                </button>

                <button
                  onClick={async (e) => {
                    e.preventDefault()
                    await deleteComment(comment.id)
                  }}
                  disabled={deletingId === comment.id}
                  className="px-3 py-1.5 text-xs font-medium text-black bg-white border border-red-300 rounded-md hover:bg-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors disabled:opacity-60"
                >
                  {deletingId === comment.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}

           
            
          </div>
        </div>

        {/* comment content OR edit form */}
        {editingId === comment.id ? (
          <div className="space-y-3">
            <textarea
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
              rows={3}
              aria-label="Edit comment"
            />
            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  cancelEditing()
                }}
                className="px-3 py-1.5 cursor-pointer text-sm text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-100 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={async (e) => {
                  e.preventDefault()
                  await saveEdit(comment.id)
                }}
                disabled={editingSavingId === comment.id || !editingText.trim()}
                className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingSavingId === comment.id ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 leading-relaxed break-words text-sm sm:text-base">{comment.content}</p>
        )}
      </div>


                    <div className="flex items-center space-x-4 mt-2 ml-4">
                      <button
                        onClick={() => handleLikeComment(comment.id)}
                        className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200"
                      >
                        <span className="cursor-pointer">👍</span>
                        <span>{comment.likesCount ?? 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
