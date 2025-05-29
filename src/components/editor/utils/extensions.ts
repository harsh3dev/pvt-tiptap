/* eslint-disable @typescript-eslint/no-explicit-any */

import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Underline from '@tiptap/extension-underline'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import ImageResize from 'tiptap-extension-resize-image'
import { VideoUpload } from '../extensions/VideoUpload'
import { SectionCard } from '../extensions/SectionCard'

export const getDefaultExtensions = (options?: {
  onImageUpload?: (file: File) => Promise<string>
  onVideoUpload?: (file: File) => Promise<string>
}) => [
  StarterKit.configure({
    // Disable the default list items since we're adding them explicitly
    bulletList: false,
    orderedList: false,
    listItem: false,
    // Disable default image since we're using ImageResize
  }),
  ListItem.configure({
    HTMLAttributes: {
      class: 'prose-list-item',
    },
  }),
  BulletList.configure({
    HTMLAttributes: {
      class: 'prose-bullet-list',
    },
  }),
  OrderedList.configure({
    HTMLAttributes: {
      class: 'prose-ordered-list',
    },
  }),
  Highlight.configure({
    multicolor: true,
  }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: 'text-blue-500 underline cursor-pointer',
    },
  }),
  Subscript,
  Superscript,
  Underline,
  ImageResize.configure({
    allowBase64: true,
    inline: true,
    HTMLAttributes: {
      class: 'tiptap-image-resizable',
    },
  }),
  VideoUpload.configure({
    onUpload: options?.onVideoUpload,
  }),
  SectionCard,
]

export const createCustomExtensions = (
  customExtensions: any[] = [],
  options?: {
    onImageUpload?: (file: File) => Promise<string>
    onVideoUpload?: (file: File) => Promise<string>
  }
) => {
  const defaultExtensions = getDefaultExtensions(options)
  return [...defaultExtensions, ...customExtensions]
}
