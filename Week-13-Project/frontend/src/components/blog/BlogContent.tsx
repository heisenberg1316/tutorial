import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const BlogContent = ({content} : {content : string}) => {
  
  return (
    <div className="prose prose-sm sm:prose-base md:prose-lg lg:prose-xl max-w-full markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  )
}

export default BlogContent