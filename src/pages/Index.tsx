import React, { useState } from 'react'
import { TiptapEditor, SectionBasedEditor } from '@/components/editor'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createAsyncUploadHandlers } from '@/components/editor/utils/handlers'

const Index = () => {
  const [editable, setEditable] = useState(true)
  const [content, setContent] = useState('<h1>Welcome to TipTap Editor</h1><p>This is a <strong>powerful</strong> and <em>flexible</em> rich text editor built with TipTap and React.</p>')
  const [jsonContent, setJsonContent] = useState(null)
  const [showTopMenu, setShowTopMenu] = useState(false)
  const [showBubbleMenu, setShowBubbleMenu] = useState(true)
  const [sectionBasedContent, setSectionBasedContent] = useState(null)

  const handleUpdate = ({ html, json }: { html: string; json: object }) => {
    setContent(html)
    setJsonContent(json)
    console.log('Content updated:', { html, json })
  }

  const handleSectionUpdate = ({ html, json, sections }: { html: string; json: object; sections: unknown[] }) => {
    setSectionBasedContent({ html, json, sections })
    console.log('Section content updated:', { html, json, sections })
  }

  // Create async upload handlers using the utility function
  const { asyncImageUpload, asyncVideoUpload } = createAsyncUploadHandlers(
    async (file: File): Promise<string> => {
      // Simulate upload process
      console.log('Uploading image:', file.name)
      await new Promise(resolve => setTimeout(resolve, 1000))
      return URL.createObjectURL(file)
    },
    async (file: File): Promise<string> => {
      // Simulate upload process
      console.log('Uploading video:', file.name)
      await new Promise(resolve => setTimeout(resolve, 1000))
      return URL.createObjectURL(file)
    }
  )

  const sampleHtmlContent = `
    <h1>Sample HTML Content</h1>
    <p>This is a <strong>rich text</strong> editor with <em>multiple features</em>.</p>
    <ul>
      <li>Bold and italic formatting</li>
      <li>Lists and links</li>
      <li>Image and video uploads</li>
      <li>Code highlighting</li>
    </ul>
    <p>Try editing this content!</p>
  `

  const sampleJsonContent = {
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: { level: 1 },
        content: [{ type: 'text', text: 'Sample JSON Content' }]
      },
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'This content was loaded from ' },
          { type: 'text', text: 'JSON format', marks: [{ type: 'bold' }] },
          { type: 'text', text: ' instead of HTML.' }
        ]
      }
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            TipTap Rich Text Editor
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            A powerful, modular editor with custom extensions and section-based editing
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Editor Controls</h2>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="editable"
                checked={editable}
                onCheckedChange={setEditable}
              />
              <Label htmlFor="editable">Editable</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="topMenu"
                checked={showTopMenu}
                onCheckedChange={setShowTopMenu}
              />
              <Label htmlFor="topMenu">Top Menu</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="bubbleMenu"
                checked={showBubbleMenu}
                onCheckedChange={setShowBubbleMenu}
              />
              <Label htmlFor="bubbleMenu">Bubble Menu</Label>
            </div>
          </div>
          
          <div className="mt-4 flex gap-2">
            <Button
              onClick={() => {
                setContent(sampleHtmlContent)
                setJsonContent(null)
              }}
              variant="outline"
            >
              Load HTML Content
            </Button>
            <Button
              onClick={() => {
                setContent('')
                setJsonContent(sampleJsonContent)
              }}
              variant="outline"
            >
              Load JSON Content
            </Button>
            <Button
              onClick={() => {
                setContent('')
                setJsonContent(null)
              }}
              variant="outline"
            >
              Clear Content
            </Button>
          </div>
        </div>

        {/* Tabs for different editors */}
        <Tabs defaultValue="regular" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="regular">Regular Editor</TabsTrigger>
            <TabsTrigger value="sections">Section-Based Editor</TabsTrigger>
          </TabsList>
          
          <TabsContent value="regular" className="mt-6">
            {/* Regular Editor */}
            <TiptapEditor
              content={content}
              jsonContent={jsonContent}
              editable={editable}
              showTopMenu={showTopMenu}
              showBubbleMenu={showBubbleMenu}
              onUpdate={handleUpdate}
              onImageUpload={asyncImageUpload}
              onVideoUpload={asyncVideoUpload}
              placeholder="Start typing your content here..."
              className="min-h-[300px] rounded-md"
            />
          </TabsContent>
          
          <TabsContent value="sections" className="mt-6">
            {/* Section-Based Editor */}
            <SectionBasedEditor
              content={sectionBasedContent}
              editable={editable}
              onUpdate={handleSectionUpdate}
              placeholder="Start typing your section-based content here..."
              className="min-h-[300px] rounded-md"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Index
