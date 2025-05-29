/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useMemo, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { generateJSON } from '@tiptap/html'
import TopMenuBar from './TopMenuBar'
import BubbleMenu from './BubbleMenu'
import { getDefaultExtensions, createCustomExtensions } from './utils/extensions'
import { handleUpdate } from './utils/handlers'
import { useSectionEditor } from '../../hooks/useSectionEditor'
import { processSections } from './utils/markdownParser'

interface TiptapEditorProps {
  content?: string
  jsonContent?: any
  markdownContent?: string
  editable?: boolean
  showTopMenu?: boolean
  showBubbleMenu?: boolean
  className?: string
  placeholder?: string
  customExtensions?: any[]
  onUpdate?: (content: { html: string; json: any }) => void
  onImageUpload?: (file: File) => Promise<string>
  onVideoUpload?: (file: File) => Promise<string>
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content = '',
  jsonContent,
  markdownContent,
  editable = true,
  showTopMenu = true,
  showBubbleMenu = true,
  className = '',
  placeholder = 'Start typing...',
  customExtensions = [],
  onUpdate,
  onImageUpload,
  onVideoUpload,
}) => {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
  // Memoize extensions to prevent recreation on every render
  const extensions = useMemo(() => {
    return createCustomExtensions(customExtensions, {
      onImageUpload,
      onVideoUpload,
    })
  }, [customExtensions, onImageUpload, onVideoUpload])

  const editor = useEditor({
    extensions,
    editable,
    content: jsonContent || content,
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none dark:prose-invert ${className}`,
      },
    },
    onUpdate: ({ editor }) => {
      handleUpdate(editor, onUpdate)
    },
    // Prevent initial content from setting cursor to end
    autofocus: false,
    // Ensure immediate updates don't affect cursor position
    immediatelyRender: false,
  })

  // Handle content updates without affecting cursor position
  useEffect(() => {
    if (editor && content && !jsonContent && editor.getHTML() !== content) {
      // Convert HTML to JSON if needed
      const json = generateJSON(content, extensions)
      
      // Set content without triggering cursor reset, only if content is different
      editor.commands.setContent(json, false)
    }
  }, [content, editor, jsonContent, extensions])

  // Handle JSON content updates without affecting cursor position
  useEffect(() => {
    if (editor && jsonContent && JSON.stringify(editor.getJSON()) !== JSON.stringify(jsonContent)) {
      // Set content without triggering cursor reset
      editor.commands.setContent(jsonContent, false)
    }
  }, [jsonContent, editor])

  // Handle editable state changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(editable)
    }
  }, [editable, editor])

  // Handle markdown content updates - convert to sections
  useEffect(() => {
    if (editor && markdownContent && markdownContent.trim()) {
      // Process sections from markdown content
      const sections = processSections(markdownContent)
      
      // Create document content with sections as SectionCards
      const docContent = {
        type: 'doc',
        content: sections.map((section) => ({
          type: 'sectionCard',
          attrs: {
            title: section.title,
            content: section.content,
          },
        }))
      }
      
      // Set content as sections
      editor.commands.setContent(docContent, false)
    }
  }, [markdownContent, editor])

  return (
    <div className=" border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 shadow-sm">
      {showTopMenu && (
        <TopMenuBar
          editor={editor}
          onImageUpload={onImageUpload}
          onVideoUpload={onVideoUpload}
          onLinkDialogOpenChange={setIsLinkDialogOpen}
        />
      )}
      
      <div className="relative">
        <EditorContent
          editor={editor}
          className="min-h-[200px] p-4 [&_.ProseMirror]:outline-none"
          placeholder={placeholder}
        />
        
        {showBubbleMenu && <BubbleMenu editor={editor} isLinkDialogOpen={isLinkDialogOpen} />}
      </div>
    </div>
  )
}

export default TiptapEditor
