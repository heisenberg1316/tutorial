

interface ShowModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete: () => void;
  page: string;
}

const ShowModal = ({setShowModal, handleDelete, page} : ShowModalProps) => {
  return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 w-[90%] max-w-md">
            <h2 className="text-lg font-semibold text-gray-800">Delete Confirmation</h2>

            <p className="mt-2 text-sm text-gray-600">{page=="createblog" ? "Are you sure you want to clear the blog data" : "Are you sure you want to delete the blog"}</p>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm rounded-md hover:cursor-pointer border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm rounded-md hover:cursor-pointer bg-red-600 text-white hover:bg-red-700 transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
  )
}

export default ShowModal