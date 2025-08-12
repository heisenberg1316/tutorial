import { useState } from "react"
import type { BlogPost } from "../types/types"
import ShowModal from "./ShowModal"
import BgOverlay from "./BgOverlay"

interface DeleteDataProps {
  id ?: string
  setBlogPost: React.Dispatch<React.SetStateAction<BlogPost>>
  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>
}

const DeleteData = ({ id, setBlogPost, setImagePreview }: DeleteDataProps) => {
  const [showModal, setShowModal] = useState(false)

  const handleDelete = (id : string) => {
    localStorage.removeItem(`autosave-blogpost-${id}`)
    setBlogPost({
      title: "",
      content: "",
      published: false,
      tags: [],
      image: null,
    })
    setImagePreview(null)
    setShowModal(false)
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex self-end cursor-pointer text-center text-xs sm:text-lg items-center justify-center px-1 py-3 lg:px-2 rounded-lg bg-red-600 text-white hover:bg-red-800 transition"
      >
        Delete Data
      </button>

      {/* Modal */}
      {showModal && (
        <>
          <BgOverlay />
          <ShowModal setShowModal={setShowModal} handleDelete={() => handleDelete(id)} page={"createblog"} />
        </>
      )}
    </>
  )
}

export default DeleteData
