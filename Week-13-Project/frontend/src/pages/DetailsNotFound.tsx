import { Link } from 'react-router-dom'

interface props{
  type : string
}

const DetailsNotFound = ({type} : props) => {
  return (
    <div className="h-[calc(100vh-100px)] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            {type=="blog" ?
              <div className="w-20 h-20 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center">
                <div className="text-4xl">📝</div>
              </div>
              : 
              <div className="w-20 h-20 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center">
                  <div className="text-4xl">👤</div>
              </div>
            }
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{type=="blog" ? "Blog Post Not Found" : "User Not Found"}</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {type=="blog" ? "The blog post you're looking for doesn't exist or may have been removed." : "The user you're looking for doesn't exist or may have been removed."}
            </p>
            <div className="space-y-3">
              <Link
                to="/"
                className="block w-full px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                Back to Home
              </Link>
              {type=="blog" && 
                <Link
                  to="/createblog"
                  className="block w-full px-6 py-3 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                >
                    Create New Post
                </Link>}
            </div>
          </div>
        </div>
      </div>
  )
}

export default DetailsNotFound