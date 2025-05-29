import React from 'react'
import { Editor } from '@tiptap/react'

export interface EditorHandlers {
  handleImageUpload: (editor: Editor, onUpload?: (file: File) => Promise<string>) => void
  handleVideoUpload: (editor: Editor, onUpload?: (file: File) => Promise<string>) => void
  handleLinkAdd: (editor: Editor, url: string, text?: string) => void
  handleUpdate: (editor: Editor, onUpdate?: (content: { html: string; json: object }) => void) => void
  getCurrentLinkUrl: (editor: Editor) => string
  getCurrentText: (editor: Editor) => string
}

/**
 * Handle image upload with file picker
 */
export const handleImageUpload = (editor: Editor, onUpload?: (file: File) => Promise<string>) => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      let src: string
      if (onUpload) {
        src = await onUpload(file)
      } else {
        src = URL.createObjectURL(file)
      }
      editor.chain().focus().setImage({ src }).run()
    }
  }
  input.click()
}

/**
 * Handle video upload with file picker
 */
export const handleVideoUpload = (editor: Editor, onUpload?: (file: File) => Promise<string>) => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'video/*'
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      let src: string
      if (onUpload) {
        src = await onUpload(file)
      } else {
        src = URL.createObjectURL(file)
      }
      editor.chain().focus().setVideo({ src, title: file.name }).run()
    }
  }
  input.click()
}

/**
 * Handle link addition to editor
 */
export const handleLinkAdd = (editor: Editor, url: string, text?: string) => {
  const { from, to } = editor.state.selection
  
  if (text && from !== to) {
    // Replace selected text with new text and link
    editor.chain()
      .focus()
      .deleteSelection()
      .insertContent({
        type: 'text',
        text: text,
        marks: [{ type: 'link', attrs: { href: url } }]
      })
      .run()
  } else if (text) {
    // Insert new text with link at cursor position
    editor.chain()
      .focus()
      .insertContent({
        type: 'text',
        text: text,
        marks: [{ type: 'link', attrs: { href: url } }]
      })
      .run()
  } else if (from !== to) {
    // Apply link to current selection
    editor.chain().focus().setLink({ href: url }).run()
  } else {
    // Insert URL as both text and link at cursor position
    editor.chain()
      .focus()
      .insertContent({
        type: 'text',
        text: url,
        marks: [{ type: 'link', attrs: { href: url } }]
      })
      .run()
  }
}

/**
 * Handle editor content updates
 */
export const handleUpdate = (editor: Editor, onUpdate?: (content: { html: string; json: object }) => void) => {
  if (onUpdate) {
    const html = editor.getHTML()
    const json = editor.getJSON()
    onUpdate({ html, json })
  }
}

/**
 * Get current link URL from editor
 */
export const getCurrentLinkUrl = (editor: Editor): string => {
  const { href } = editor.getAttributes('link')
  return href || ''
}

/**
 * Get current selected text from editor
 */
export const getCurrentText = (editor: Editor): string => {
  const { from, to } = editor.state.selection
  return editor.state.doc.textBetween(from, to)
}

/**
 * Create upload handler functions for async file uploads
 */
export const createAsyncUploadHandlers = (
  onImageUpload?: (file: File) => Promise<string>,
  onVideoUpload?: (file: File) => Promise<string>
) => {
  const asyncImageUpload = async (file: File): Promise<string> => {
    if (onImageUpload) {
      return await onImageUpload(file)
    }
    // Default implementation
    return URL.createObjectURL(file)
  }

  const asyncVideoUpload = async (file: File): Promise<string> => {
    if (onVideoUpload) {
      return await onVideoUpload(file)
    }
    // Default implementation
    return URL.createObjectURL(file)
  }

  return { asyncImageUpload, asyncVideoUpload }
}

/**
 * Create file upload handler for image components
 */
export const createImageUploadHandler = (
  updateAttributes: (attrs: { src: string; alt: string }) => void,
  setIsLoading: (loading: boolean) => void,
  onUpload?: (file: File) => Promise<string>
) => {
  return async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    try {
      let src: string
      if (onUpload) {
        src = await onUpload(file)
      } else {
        src = URL.createObjectURL(file)
      }
      updateAttributes({ src, alt: file.name })
    } catch (error) {
      console.error('Image upload failed:', error)
    } finally {
      setIsLoading(false)
    }
  }
}

/**
 * Create file upload handler for video components
 */
export const createVideoUploadHandler = (
  updateAttributes: (attrs: { src: string; title: string }) => void,
  setIsLoading: (loading: boolean) => void,
  onUpload?: (file: File) => Promise<string>
) => {
  return async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    try {
      let src: string
      if (onUpload) {
        src = await onUpload(file)
      } else {
        src = URL.createObjectURL(file)
      }
      updateAttributes({ src, title: file.name })
    } catch (error) {
      console.error('Video upload failed:', error)
    } finally {
      setIsLoading(false)
    }
  }
}
