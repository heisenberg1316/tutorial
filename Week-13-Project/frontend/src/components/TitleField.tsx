
type TitleFieldProps = {
  title: string
  setTitle: (title: string) => void
}

const TitleField = ({title, setTitle} : TitleFieldProps) => {
  return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Post Title</h3>
            <p className="text-sm text-gray-600 mt-1">Give your blog post a compelling title</p>
            </div>
            <div className="p-4 sm:p-6">
            <input
                type="text"
                placeholder="Enter your blog post title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-base sm:text-lg font-medium border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
            />
            </div>
        </div>
  )
}

export default TitleField