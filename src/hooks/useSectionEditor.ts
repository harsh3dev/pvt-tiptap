import { useEffect } from 'react'
import { Editor } from '@tiptap/react'
import { processSections, ParsedSection } from '../components/editor/utils/markdownParser'

interface UseSectionEditorProps {
  editor: Editor | null
  rawContent: string
}

/**
 * Hook to manage section-based content in TipTap editor
 */
export const useSectionEditor = ({ editor, rawContent }: UseSectionEditorProps) => {  // Process content whenever rawContent changes
  useEffect(() => {
    if (editor && rawContent) {
      // Parse sections and convert markdown to HTML
      const sections: ParsedSection[] = processSections(rawContent)
      
      // Create the document content with all sections
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
      
      // Set the entire content at once
      editor.commands.setContent(docContent)
    }
  }, [editor, rawContent])
}
