import React, { useState } from 'react'
import { TiptapEditor } from '@/components/editor'
import { createAsyncUploadHandlers } from '@/components/editor/utils/handlers'

const Index = () => {
  const [content, setContent] = useState('')
  const [jsonContent, setJsonContent] = useState(null)
  
  // Sample markdown content with sections
  const sampleMarkdownContent = `## Course Title
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
- Certificate of completion`

  const handleUpdate = ({ html, json }: { html: string; json: object }) => {
    setContent(html)
    setJsonContent(json)
    console.log('Content updated:', { html, json })
  }

  // Create async upload handlers using the utility function
  const { asyncImageUpload, asyncVideoUpload } = createAsyncUploadHandlers(
    async (file: File): Promise<string> => {
      // Simulate upload process
      console.log('Uploading image:', file.name)
      await new Promise(resolve => setTimeout(resolve, 1000))
      return URL.createObjectURL(file)
    },
    async (file: File): Promise<string> => {
      // Simulate upload process
      console.log('Uploading video:', file.name)
      await new Promise(resolve => setTimeout(resolve, 1000))
      return URL.createObjectURL(file)
    }
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          
          <TiptapEditor
            markdownContent={sampleMarkdownContent}
            editable={true}
            showTopMenu={true}
            showBubbleMenu={true}
            onUpdate={handleUpdate}
            onImageUpload={asyncImageUpload}
            onVideoUpload={asyncVideoUpload}
            placeholder="Start typing your content here..."
            className="min-h-[400px] rounded-md"
          />
        </div>
      </div>
    </div>  )
}

export default Index
