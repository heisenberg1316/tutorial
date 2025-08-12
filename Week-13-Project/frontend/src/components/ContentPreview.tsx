import ReactMarkdown from 'react-markdown';
import remarkGfm     from 'remark-gfm';

const ContentPreview = ({blogPost}) => {
  return (
    <div className="prose markdown border-2 rounded-xl border-gray-300 shadow-xl px-2 max-h-[600px] max-w-[900px] overflow-auto">
      <ReactMarkdown
        // ← this plugin makes ```js … ``` render as a real block
        remarkPlugins={[remarkGfm]}
      >
        {blogPost.content}
      </ReactMarkdown>
    </div>
  );
};

export default ContentPreview;
