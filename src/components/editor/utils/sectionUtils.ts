/* eslint-disable @typescript-eslint/no-explicit-any */

import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

export interface ParsedSection {
  title: string
  content: string
}

// Simple parser - just listen for ## and split content
export const parseIntoSections = (markdownContent: string): ParsedSection[] => {
  const sections: ParsedSection[] = []
  const lines = markdownContent.split('\n')
  let currentTitle = ''
  let currentContent: string[] = []

  lines.forEach((line) => {
    if (line.trim().startsWith('##')) {
      // Save previous section
      if (currentTitle) {
        sections.push({
          title: currentTitle,
          content: currentContent.join('\n').trim()
        })
      }
      
      // Start new section
      currentTitle = line.trim().replace(/^##\s*/, '')
      currentContent = []
    } else if (currentTitle) {
      currentContent.push(line)
    }
  })

  // Add final section
  if (currentTitle) {
    sections.push({
      title: currentTitle,
      content: currentContent.join('\n').trim()
    })
  }

  return sections
}

// Convert markdown content to HTML using a temporary editor
export const markdownToHtml = (markdown: string): string => {
  try {
    const tempEditor = new Editor({
      extensions: [StarterKit],
      content: markdown,
    })
    
    const html = tempEditor.getHTML()
    tempEditor.destroy()
    return html
  } catch (error) {
    console.error('Error converting markdown to HTML:', error)
    return markdown // Return original content as fallback
  }
}

// Process sections and convert markdown content to HTML
export const processSections = (rawContent: string): Array<{ title: string; content: string }> => {
  const sections = parseIntoSections(rawContent)
  
  return sections.map(section => ({
    title: section.title,
    content: markdownToHtml(section.content)
  }))
}
