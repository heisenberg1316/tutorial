import { FaEye, FaEyeSlash } from "react-icons/fa"

type PublishFieldProps = {
  published: boolean
  setPublished: (published: boolean) => void
}

const PublishField = ({ published, setPublished }: PublishFieldProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Publish Settings</h3>
        <p className="text-sm text-gray-600 mt-1">
          Choose whether to publish immediately or save as draft
        </p>
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {published ? (
              <FaEye className="h-5 w-5 text-green-600" />
            ) : (
              <FaEyeSlash className="h-5 w-5 text-gray-400" />
            )}

            <div>
              <label className="text-sm font-medium text-gray-900">
                {published ? "Publish immediately" : "Save as draft"}
              </label>
              <p className="text-xs text-gray-500">
                {published
                  ? "Your post will be visible to everyone"
                  : "Your post will be saved privately"}
              </p>
            </div>
          </div>

          {/* Toggle switch */}
          <button
            type="button"
            onClick={() => setPublished(!published)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              published ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                published ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  )
}

export default PublishField
