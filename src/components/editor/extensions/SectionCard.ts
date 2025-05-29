/* eslint-disable @typescript-eslint/no-explicit-any */

import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import SectionCardComponent from '../components/SectionCardComponent'

export interface SectionCardOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    sectionCard: {
      setSectionCard: (options: { title: string; content: string }) => ReturnType
    }
  }
}

export const SectionCard = Node.create<SectionCardOptions>({
  name: 'sectionCard',
    addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  draggable: true,

  group: 'block',
  
  content: '',
  
  atom: true,
  
  addAttributes() {
    return {
      title: {
        default: '',
      },
      content: {
        default: '',
      },
    }  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="section-card"]',
        getAttrs: (element) => {
          const dom = element as HTMLElement
          return {
            title: dom.getAttribute('data-title') || '',
            content: dom.getAttribute('data-content') || '',
          }
        },
      },
    ]
  },
  renderHTML({ HTMLAttributes, node }) {
    return [
      'div', 
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 
        'data-type': 'section-card',
        'data-title': node.attrs.title,
        'data-content': node.attrs.content
      })
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(SectionCardComponent)
  },

  addCommands() {
    return {
      setSectionCard:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
    }
  },
})
