import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Edit3 } from 'lucide-react';

const TipTapSectionEditor = () => {
  const [sections, setSections] = useState([]);
  
  // Sample content from backend
  const backendContent = `## Course Title
This is the course title
## Course Overview
Master Figma from the ground up in this comprehensive course designed for beginners and intermediate users. You'll start with the basics of interface design and quickly move into advanced features like components, auto layout, prototyping, and team collaboration. By the end of this course, you'll be able to confidently design, prototype, and hand off high-quality UI/UX projects using Figma's full toolset.
## Learning Objectives
1. Design responsive interfaces using Figma tools.
2. Create reusable components and organized variants effectively.
3. Build interactive prototypes and collaborate with teams efficiently.`;

  const editor = useEditor({
    extensions: [StarterKit],
    content: backendContent,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getText();
      parseSections(content);
    },
  });

  // Function to parse content into sections based on ##
  const parseSections = (content) => {
    const lines = content.split('\n');
    const parsedSections = [];
    let currentSection = null;
    let currentContent = [];

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      
      // Check if line starts with ##
      if (trimmedLine.startsWith('##')) {
        // Save previous section if exists
        if (currentSection) {
          parsedSections.push({
            title: currentSection,
            content: currentContent.join('\n').trim()
          });
        }
        
        // Start new section
        currentSection = trimmedLine.replace(/^##\s*/, '');
        currentContent = [];
      } else if (currentSection && trimmedLine) {
        // Add content to current section
        currentContent.push(line);
      }
    });

    // Add the last section
    if (currentSection) {
      parsedSections.push({
        title: currentSection,
        content: currentContent.join('\n').trim()
      });
    }

    setSections(parsedSections);
  };

  // Parse sections on initial load
  useEffect(() => {
    if (editor) {
      const content = editor.getText();
      parseSections(content);
    }
  }, [editor]);

  // Section Card Component
  const SectionCard = ({ title, content, index }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editableContent, setEditableContent] = useState(content);

    const sectionEditor = useEditor({
      extensions: [StarterKit],
      content: content,
      editorProps: {
        attributes: {
          class: 'prose prose-sm focus:outline-none p-4 min-h-[100px]',
        },
      },
      onUpdate: ({ editor }) => {
        setEditableContent(editor.getHTML());
      },
    });

    const handleSave = () => {
      setIsEditing(false);
      // Here you would typically update the main editor content
      // and sync with backend
    };

    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-4 overflow-hidden">
        {/* Section Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            <Edit3 size={16} />
            {isEditing ? 'Save' : 'Edit'}
          </button>
        </div>

        {/* Section Content */}
        <div className="p-6">
          {isEditing ? (
            <div className="border border-gray-200 rounded-md">
              <EditorContent 
                editor={sectionEditor}
                className="min-h-[100px]"
              />
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              {content.split('\n').map((line, idx) => {
                if (line.trim().match(/^\d+\./)) {
                  return (
                    <div key={idx} className="flex items-start gap-2 mb-2">
                      <span className="text-blue-600 font-medium">
                        {line.trim().match(/^\d+/)[0]}.
                      </span>
                      <span className="text-gray-700">
                        {line.trim().replace(/^\d+\.\s*/, '')}
                      </span>
                    </div>
                  );
                }
                return (
                  <p key={idx} className="text-gray-700 mb-2 leading-relaxed">
                    {line}
                  </p>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Content Editor</h1>
        
        {/* Original Editor (Hidden for now, but you can show it for debugging) */}
        <details className="mb-6">
          <summary className="cursor-pointer text-sm text-gray-600 mb-2">
            Show Raw Editor (for debugging)
          </summary>
          <div className="border border-gray-300 rounded-md p-4 bg-white">
            <EditorContent editor={editor} />
          </div>
        </details>
      </div>

      {/* Rendered Sections */}
      <div className="space-y-4">
        {sections.map((section, index) => (
          <SectionCard
            key={index}
            title={section.title}
            content={section.content}
            index={index}
          />
        ))}
      </div>

      {/* Debug Info */}
      <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-2">Debug Info:</h3>
        <p className="text-sm text-gray-600">
          Found {sections.length} sections
        </p>
        <details className="mt-2">
          <summary className="cursor-pointer text-sm text-gray-600">
            Show parsed sections
          </summary>
          <pre className="text-xs mt-2 p-2 bg-gray-50 rounded overflow-auto">
            {JSON.stringify(sections, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
};

export default TipTapSectionEditor;