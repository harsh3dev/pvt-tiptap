import { marked } from 'marked'

export interface ParsedSection {
  title: string
  content: string
}

/**
 * Simple parser - listen for ## headers and split content into sections
 */
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

/**
 * Convert markdown content to HTML using marked
 */
export const markdownToHtml = (markdown: string): string => {
  try {
    // Configure marked for better list handling
    marked.setOptions({
      breaks: true,
      gfm: true,
    })
    
    const html = marked.parse(markdown)
    return typeof html === 'string' ? html : markdown
  } catch (error) {
    console.error('Error converting markdown to HTML:', error)
    return markdown // Return original content as fallback
  }
}

/**
 * Process sections and convert markdown content to HTML
 */
export const processSections = (markdownContent: string): ParsedSection[] => {
  const sections = parseIntoSections(markdownContent)
  
  return sections.map(section => ({
    title: section.title,
    content: markdownToHtml(section.content)
  }))
}
