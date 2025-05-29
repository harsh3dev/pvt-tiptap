/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { createCustomExtensions } from './utils/extensions'
import { useSectionEditor } from '../../hooks/useSectionEditor'
import { Button } from '../ui/button'

interface SectionBasedEditorProps {
  content?: any
  initialContent?: string
  editable?: boolean
  onUpdate?: (content: { html: string; json: any; sections: any[] }) => void
  placeholder?: string
  className?: string
}

const SectionBasedEditor: React.FC<SectionBasedEditorProps> = ({
  content,  initialContent = `## Course Title
Figma Beginner To Advance

## Course Overview
Master Figma from the ground up in this comprehensive course designed for beginners and intermediate users. You'll start with the basics of interface design and quickly move into advanced features like components, auto layout, prototyping, and team collaboration. 

By the end of this course, you'll be able to confidently design, prototype, and hand off high-quality UI/UX projects using Figma's full toolset.

## Learning Objectives
1. Design responsive interfaces using Figma tools
2. Create reusable components and organized variants effectively
3. Build interactive prototypes and collaborate with teams efficiently
4. Master advanced layout techniques with auto layout
5. Implement design systems and style guides

## Key Features
- Interactive lessons with real-world projects
- Hands-on exercises and practical assignments
- Access to premium Figma resources and templates
- Community support and feedback
- Certificate of completion`,
  editable = true,
  onUpdate,
  placeholder = 'Start typing your section-based content here...',
  className = ''
}) => {
  const [rawContent, setRawContent] = useState(initialContent)
  const [showMarkdown, setShowMarkdown] = useState(false)
  const editor = useEditor({
    extensions: createCustomExtensions(),
    content: '',
    editable,
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
      },
    },    onUpdate: ({ editor }) => {
      if (onUpdate) {
        try {
          const html = editor.getHTML()
          const json = editor.getJSON()
          // Extract sections from editor content
          const sections = json.content?.filter((node: any) => node.type === 'sectionCard') || []
          onUpdate({ html, json, sections })
        } catch (error) {
          console.warn('Error during editor update:', error)
          // Still call onUpdate with minimal data to avoid breaking the app
          if (onUpdate) {
            const json = editor.getJSON()
            const sections = json.content?.filter((node: any) => node.type === 'sectionCard') || []
            onUpdate({ html: '', json, sections })
          }
        }
      }
    },
  })

  // Use the section editor hook to manage content
  useSectionEditor({ editor, rawContent })
  const loadDifferentContent = () => {
    setRawContent(`## Project Setup
Install the necessary dependencies and set up your development environment.

### Prerequisites
- Node.js v16 or higher
- npm or yarn package manager
- Git for version control
- Code editor (VS Code recommended)

## API Configuration
Configure your API endpoints and authentication settings.

**Important**: Make sure to keep your API keys secure and never commit them to version control.

1. Create a .env file in your project root
2. Add your API keys and configuration
3. Update your environment variables
4. Test the API connection

## Database Setup
Follow these steps to set up your database:

1. Create a new database instance
2. Run migrations to set up tables
3. Seed initial data for testing
4. Configure connection strings
5. Test database connectivity

## Deployment
Deploy your application to production using these recommended steps.`)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Controls */}
      <div className="flex items-center justify-between gap-4">        
        <Button
          onClick={() => setShowMarkdown(!showMarkdown)}
          variant="outline"
          size="sm"
        >
          {showMarkdown ? 'Hide' : 'Show'} Markdown
        </Button>
      </div>

      <div className="space-y-0">
        <EditorContent editor={editor} />
      </div>

      {showMarkdown && (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-medium text-gray-700 mb-2">
            Edit Markdown Content
          </h3>
          <textarea
            value={rawContent}
            onChange={(e) => setRawContent(e.target.value)}
            className="w-full h-40 p-3 border border-gray-200 rounded-md font-mono text-sm"
            placeholder="Enter markdown content with ## headers..."
          />
          <p className="text-xs text-gray-500 mt-2">
            Edit the content above to see sections update in real-time
          </p>
        </div>
      )}
    </div>
  )
}

export default SectionBasedEditor
