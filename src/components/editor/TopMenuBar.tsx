
import React, { useState } from 'react'
import { Editor } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Bold, Italic, Underline, Code, Link, Subscript, Superscript, Image, Video, List, ListOrdered, FileText } from 'lucide-react'
import LinkDialog from './components/LinkDialog'
import { 
  handleImageUpload, 
  handleVideoUpload, 
  handleLinkAdd, 
  getCurrentLinkUrl, 
  getCurrentText 
} from './utils/handlers'

interface TopMenuBarProps {
  editor: Editor | null
  onImageUpload?: (file: File) => Promise<string>
  onVideoUpload?: (file: File) => Promise<string>
  onLinkDialogOpenChange?: (isOpen: boolean) => void
}

const TopMenuBar: React.FC<TopMenuBarProps> = ({ editor, onImageUpload, onVideoUpload, onLinkDialogOpenChange }) => {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)

  const handleLinkDialogOpen = (open: boolean) => {
    setIsLinkDialogOpen(open)
    onLinkDialogOpenChange?.(open)
  }

  const handleInsertSectionCard = () => {
    if (editor) {
      editor.chain().focus().setSectionCard({
        title: 'New Section',
        content: '<p>Enter your content here...</p>'
      }).run()
    }
  }

  if (!editor) return null

  return (
    <>
      <div className="border-b border-gray-200 dark:border-gray-700 p-2 flex flex-wrap items-center gap-1 bg-white dark:bg-gray-800">
        {/* Text Formatting */}
        <Tooltip>
          <TooltipTrigger asChild>
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
          </TooltipTrigger>
          <TooltipContent>
            <p>Bold (Ctrl+B)</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
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
          </TooltipTrigger>
          <TooltipContent>
            <p>Italic (Ctrl+I)</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
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
          </TooltipTrigger>
          <TooltipContent>
            <p>Underline (Ctrl+U)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={editor.isActive('highlight') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                editor.chain().focus().toggleHighlight().run()
              }}
              className="h-8 px-2"
            >
              H
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Highlight</p>
          </TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6" />

        {/* Code and Links */}
        <Tooltip>
          <TooltipTrigger asChild>
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
          </TooltipTrigger>
          <TooltipContent>
            <p>Inline Code (Ctrl+`)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={editor.isActive('link') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleLinkDialogOpen(true)}
              className="h-8 w-8 p-0"
            >
              <Link className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add Link (Ctrl+K)</p>
          </TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6" />

        {/* Subscript/Superscript */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={editor.isActive('subscript') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                editor.chain().focus().toggleSubscript().run()
              }}
              className="h-8 w-8 p-0"
            >
              <Subscript className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Subscript</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={editor.isActive('superscript') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                editor.chain().focus().toggleSuperscript().run()
              }}
              className="h-8 w-8 p-0"
            >
              <Superscript className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Superscript</p>
          </TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6" />

        {/* Lists */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                editor.chain().focus().toggleBulletList().run()
              }}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bullet List</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                editor.chain().focus().toggleOrderedList().run()
              }}
              className="h-8 w-8 p-0"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Numbered List</p>
          </TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6" />

        {/* Media */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleImageUpload(editor, onImageUpload)}
              className="h-8 w-8 p-0"
            >
              <Image className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Insert Image</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVideoUpload(editor, onVideoUpload)}
              className="h-8 w-8 p-0"
            >
              <Video className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Insert Video</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleInsertSectionCard}
              className="h-8 w-8 p-0"
            >
              <FileText className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Insert Section Card</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <LinkDialog
        isOpen={isLinkDialogOpen}
        onClose={() => handleLinkDialogOpen(false)}
        onSubmit={(url, text) => handleLinkAdd(editor, url, text)}
        initialUrl={getCurrentLinkUrl(editor)}
        initialText={getCurrentText(editor)}
      />
    </>
  )
}

export default TopMenuBar
