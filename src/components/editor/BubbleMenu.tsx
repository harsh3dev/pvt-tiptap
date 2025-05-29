
import React, { useState } from 'react'
import { BubbleMenu as TiptapBubbleMenu, Editor } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import { Bold, Italic, Underline, Code } from 'lucide-react'

interface BubbleMenuProps {
  editor: Editor | null
  isLinkDialogOpen?: boolean
}

const BubbleMenu: React.FC<BubbleMenuProps> = ({ editor, isLinkDialogOpen = false }) => {
  if (!editor) return null

  return (
    <>
      <TiptapBubbleMenu
        editor={editor}
        tippyOptions={{ 
          duration: 100,
          placement: 'top',
        }}
        shouldShow={({ editor, view, state }) => {
          // Hide bubble menu when link dialog is open
          if (isLinkDialogOpen) return false
          
          // Show bubble menu when there's a selection or when editor is focused
          const { selection } = state
          const { empty } = selection
          
          // Hide if the editor is not focused
          if (!view.hasFocus()) return false
          
          // Show if there's a text selection
          if (!empty) return true
          
          // Hide in other cases
          return false
        }}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 flex items-center gap-1"
      >
        <Button
          variant={editor.isActive('bold') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => {
            editor.chain().focus().toggleBold().run()
          }}
          className="h-8 w-8 p-0"
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          variant={editor.isActive('italic') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => {
            editor.chain().focus().toggleItalic().run()
          }}
          className="h-8 w-8 p-0"
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <Button
          variant={editor.isActive('underline') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => {
            editor.chain().focus().toggleUnderline().run()
          }}
          className="h-8 w-8 p-0"
        >
          <Underline className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive('code') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => {
            editor.chain().focus().toggleCode().run()
          }}
          className="h-8 w-8 p-0"
        >
          <Code className="h-4 w-4" />
        </Button>
      </TiptapBubbleMenu>
    </>
  )
}

export default BubbleMenu
