
const Spinner = () => (
  <svg
    className="animate-spin h-4 w-4 inline-block align-middle"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
  </svg>
);

const DeleteModal = ({ setDelAccount, handleDelete, isDeleting = false }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-labelledby="delete-title"
      aria-busy={isDeleting}
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-[90%] max-w-md">
        <h2 id="delete-title" className="text-lg font-semibold text-gray-800">
          Delete Confirmation
        </h2>

        <p className="mt-2 text-sm text-gray-600">Are you sure you want to delete your profile?</p>

        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={() => !isDeleting && setDelAccount(false)}
            className={`px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition ${
              isDeleting ? "opacity-60 cursor-not-allowed" : "hover:cursor-pointer"
            }`}
            disabled={isDeleting}
          >
            Cancel
          </button>

          <button
            onClick={() => !isDeleting && handleDelete()}
            className={`px-4 py-2 text-sm rounded-md bg-red-600 text-white transition flex items-center justify-center ${
              isDeleting ? "opacity-60 cursor-not-allowed" : "hover:bg-red-700"
            }`}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Spinner />
                <span className="ml-2">Deleting...</span>
              </>
            ) : (
              "Yes, Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
