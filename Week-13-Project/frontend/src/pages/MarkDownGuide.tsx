"use client"

import { useState } from "react"
import ReactMarkdown from "react-markdown"
import { Link } from "react-router-dom"

const MarkdownGuide = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null)

  const copyToClipboard = (text: string, section: string) => {
      navigator.clipboard.writeText(text)
      setCopiedSection(section)
      setTimeout(() => setCopiedSection(null), 2000)
  }

 const sections = [
  {
    id: "headings",
    title: "Headings",
    icon: "📝",
    description: "Create hierarchical headings using # symbols",
    markdown: `# H1 - Main Title
## H2 - Section Title  
### H3 - Subsection
#### H4 - Sub-subsection
##### H5 - Minor heading
###### H6 - Smallest heading`,
    syntax: `# H1 - Main Title
## H2 - Section Title  
### H3 - Subsection
#### H4 - Sub-subsection
##### H5 - Minor heading
###### H6 - Smallest heading`,
  },
  {
    id: "formatting",
    title: "Text Formatting",
    icon: "✨",
    description: "Style your text with bold, italic, and strikethrough",
    markdown: `**Bold text** makes things stand out
*Italic text* adds emphasis
***Bold and italic*** for maximum impact
~~Strikethrough~~ for corrections`,
    syntax: `**Bold text** makes things stand out
*Italic text* adds emphasis
***Bold and italic*** for maximum impact
~~Strikethrough~~ for corrections`,
  },
  {
    id: "code",
    title: "Code",
    icon: "💻",
    description: "Display code inline or in blocks",
    markdown: `Inline code: \`const x = 42\`

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));
\`\`\``,
    syntax: `Inline code: \`const x = 42\`

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));
\`\`\``,
  },
  {
    id: "lists",
    title: "Lists",
    icon: "📋",
    description: "Create ordered and unordered lists",
    markdown: `**Ordered List:**
1. First item
2. Second item
3. Third item

**Unordered List:**
- Item A
- Item B
  - Nested item
  - Another nested item
- Item C`,
    syntax: `**Ordered List:**
1. First item
2. Second item
3. Third item

**Unordered List:**
- Item A
- Item B
  - Nested item
  - Another nested item
- Item C`,
  },
  {
    id: "links",
    title: "Links",
    icon: "🔗",
    description: "Create clickable links",
    markdown: `[Visit OpenAI](https://openai.com)
[GitHub](https://github.com)
[Documentation](https://docs.example.com)`,
    syntax: `[Visit OpenAI](https://openai.com)
[GitHub](https://github.com)
[Documentation](https://docs.example.com)`,
  },
  {
    id: "images",
    title: "Images",
    icon: "🖼️",
    description: "Embed images in your content",
    markdown: `![Beautiful Landscape](https://media.istockphoto.com/id/1381637603/photo/mountain-landscape.jpg?s=612x612&w=0&k=20&c=w64j3fW8C96CfYo3kbi386rs_sHH_6BGe8lAAAFS-y4=)`,
    syntax: `![Beautiful Landscape](https://media.istockphoto.com/id/1381637603/photo/mountain-landscape.jpg?s=612x612&w=0&k=20&c=w64j3fW8C96CfYo3kbi386rs_sHH_6BGe8lAAAFS-y4=)`,
  },
  {
    id: "blockquotes",
    title: "Blockquotes",
    icon: "💬",
    description: "Highlight important quotes or notes",
    markdown: `> "The best way to predict the future is to create it."
> — Peter Drucker

> **Pro Tip:** Use blockquotes for important notes
> and inspirational quotes in your content.`,
    syntax: `> "The best way to predict the future is to create it."
> — Peter Drucker

> **Pro Tip:** Use blockquotes for important notes
> and inspirational quotes in your content.`,
  },
  {
    id: "dividers",
    title: "Horizontal Rules",
    icon: "➖",
    description: "Create visual separators",
    markdown: `Content above the divider

---

Content below the divider

***

Another section`,
    syntax: `Content above the divider

---

Content below the divider

***

Another section`,
  },
]


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 ">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <span className="text-4xl">📚</span>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Markdown Guide
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Master the art of formatting text with Markdown. Learn the syntax that powers modern documentation, blogs,
              and README files across the web.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium">
                Easy to Learn
              </div>
              <div className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-700 dark:text-purple-300 text-sm font-medium">
                Widely Supported
              </div>
              <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-700 dark:text-green-300 text-sm font-medium">
                Interactive Examples
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:gap-12">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700"
            >
              {/* Section Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white shadow-lg">
                      <span className="text-2xl">{section.icon}</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{section.title}</h2>
                      <p className="text-slate-600 dark:text-slate-300 mt-1">{section.description}</p>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-slate-400 dark:text-slate-500">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Syntax Column */}
                <div className="p-6 bg-slate-50 dark:bg-slate-900/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Syntax</h3>
                    <button
                      onClick={() => copyToClipboard(section.syntax, section.id)}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg transition-colors text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      {copiedSection === section.id ? (
                        <>
                          <span className="text-green-600">✓</span>
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <span>📋</span>
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-slate-900 dark:bg-slate-800 rounded-xl overflow-hidden">
                    <pre className="p-4 text-sm text-slate-300 overflow-x-auto">
                      <code>{section.syntax}</code>
                    </pre>
                  </div>
                </div>

                {/* Preview Column */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Preview</h3>
                  <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:mt-4 prose-headings:mb-2 prose-p:my-2 prose-pre:my-4">
                    <ReactMarkdown
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          return !inline ? (
                            <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg overflow-x-auto text-sm">
                              <code {...props}>{String(children).replace(/\n$/, "")}</code>
                            </pre>
                          ) : (
                            <code className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-sm" {...props}>
                              {children}
                            </code>
                          )
                        },
                      }}
                    >
                      {section.markdown}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Writing?</h2>
            <p className="text-xl opacity-90 mb-6 max-w-2xl mx-auto">
              Now that you know the basics, start creating beautiful content with Markdown!
            </p>
            <Link to={"/createblog"} className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-slate-100 transition-colors shadow-lg">
              Start Writing
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarkdownGuide
