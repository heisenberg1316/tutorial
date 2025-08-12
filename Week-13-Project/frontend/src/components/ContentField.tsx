import { useRef } from "react";
import { Link } from "react-router-dom";

type ContentFieldProps = {
  content: string;
  setContent: (content: string) => void;
};

const sample = `Start writing your blog post using markdown, sample :->
# H1 Heading
## H2 Heading
### H3 Heading

**Bold text**
_Italic text_
**_Bold and italic_**

[Link text](https://example.com)

- Bullet list item 1
- Bullet list item 2
  - Nested item

1. Numbered list
2. Item 2

\`inline code\`

\`\`\`js
// Code block
function greet() {
  console.log("Hello!");
}
\`\`\`
> Blockquote text `

const ContentField = ({ content, setContent }: ContentFieldProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();

      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // Insert tab at the cursor position
      const newValue = content.slice(0, start) + "\t" + content.slice(end);
      setContent(newValue);

      // Move cursor to after the tab
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      });
    }
  };

  return (
  <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
    {/* Header */}
    <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">Content</h3>
      <p className="text-sm text-gray-600 mt-1">
        Write your blog post content
      </p>
      <p className="mt-3 text-sm">
        <span className="font-medium text-gray-800">Don’t know about Markdown? {" "}
        <Link
          to="/tutorial"
          className="inline-block text-blue-600 font-medium hover:text-blue-800 hover:underline transition-colors"
        >
          Click here
        </Link>{" "}
        for tutorial
        </span>
      </p>
    </div>

    {/* Textarea */}
    <div className="p-5">
      <textarea
        ref={textareaRef}
        placeholder={sample}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full min-h-[240px] sm:min-h-[380px] px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono shadow-sm resize-none transition"
        required
      />
      <div className="mt-2 text-xs sm:text-sm text-gray-500">
        {content.length} characters
      </div>
    </div>
  </div>
);

};

export default ContentField;











