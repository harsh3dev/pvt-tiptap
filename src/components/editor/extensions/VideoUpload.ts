/* eslint-disable @typescript-eslint/no-explicit-any */

import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import VideoComponent from '../components/VideoComponent'

export interface VideoUploadOptions {
  HTMLAttributes: Record<string, any>
  onUpload?: (file: File) => Promise<string>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    videoUpload: {
      setVideo: (options: { src: string; title?: string }) => ReturnType
    }
  }
}

export const VideoUpload = Node.create<VideoUploadOptions>({
  name: 'videoUpload',

  addOptions() {
    return {
      HTMLAttributes: {},
      onUpload: async (file: File) => {
        // Default implementation - you can override this
        return URL.createObjectURL(file)
      },
    }
  },

  group: 'block',

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      title: {
        default: null,
      },
      controls: {
        default: true,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'video[src]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['video', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },

  addCommands() {
    return {
      setVideo:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoComponent)
  },
})
