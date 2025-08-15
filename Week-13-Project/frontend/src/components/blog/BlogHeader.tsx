import { FiCalendar, FiClock, FiHeart } from "react-icons/fi"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../../context/AuthContext";

interface BlogHeaderProps {
  email: string;
  title: string;
  name: string;
  authorImage: string;
  publishDate: string;
  readTime: number;
  upvotes: number;
  likedByUser: boolean;
  handleLike: () => void;
}


export function dateConverter(publishDate: string | number | Date){
  return  new Date(publishDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default function BlogHeader({
  email, title, name, authorImage, publishDate, readTime, upvotes, likedByUser, handleLike,
}: BlogHeaderProps) {

  publishDate = dateConverter(publishDate);
  
  const navigate = useNavigate();
  const {user} = useAuth();

  return (
    <header className=" max-w-4xl mx-auto  border-b border-gray-200">
      <div>
        <div className="mx-auto px-2 sm:px-2 lg:px-6 pt-10 pb-6 ">
          <h1 className="text-3xl lg:text-4xl font-bold font-sans text-gray-900 sm:mb-8 mb-4">{title}</h1>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <img onClick={() => {
                  if(user?.email==email) navigate("/my-profile");
                  else navigate(`/user/${email}`)
                }} src={authorImage} alt={name} className="w-12 h-12 rounded-full object-cover cursor-pointer" />
              </div>

              <div className="flex flex-col text-xs sm:text-sm text-gray-500">
                <div>
                  <span className="text-sm sm:text-base font-medium text-gray-900">{name}</span>
                </div>
                <span className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <FiCalendar className="h-3 w-3 sm:h-4 sm:w-4" />
                    {publishDate}
                  </div>
                  <div className="flex items-center gap-1">
                    <FiClock className="h-3 w-3 sm:h-4 sm:w-4" />
                    {readTime} minutes read
                  </div>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 text-lg mt-0.5  sm:text-sm text-gray-500 select-none">
              <span className="flex items-center gap-2">
                <FiHeart
                  onClick={handleLike}
                  className={`h-5 w-5 sm:h-7 sm:w-7 cursor-pointer transition-all duration-200 ${likedByUser ? "text-red-500 scale-110" : "text-gray-500"}`}
                />
                {upvotes} upvotes
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
