
import React, { useState } from 'react'
import { NodeViewWrapper } from '@tiptap/react'
import { createVideoUploadHandler } from '../utils/handlers'

const VideoComponent = ({ node, updateAttributes, deleteNode, selected }: {
  node: { attrs: { src?: string; title?: string; controls?: boolean } };
  updateAttributes: (attrs: { src?: string; title?: string }) => void;
  deleteNode: () => void;
  selected: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleFileUpload = createVideoUploadHandler(updateAttributes, setIsLoading)

  return (
    <NodeViewWrapper className={`video-component ${selected ? 'ProseMirror-selectednode' : ''}`}>
      <div className="relative group">
        {node.attrs.src ? (
          <div className="relative inline-block">
            <video
              src={node.attrs.src}
              title={node.attrs.title || ''}
              controls={node.attrs.controls !== false}
              className="max-w-full h-auto rounded-lg shadow-sm block"
            />
            
            {/* Delete button */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button
                onClick={deleteNode}
                className="bg-red-500 text-white p-1 rounded-full text-xs hover:bg-red-600"
              >
                ×
              </button>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
            {isLoading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            ) : (
              <div>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className="cursor-pointer text-blue-500 hover:text-blue-600"
                >
                  Click to upload video
                </label>
              </div>
            )}
          </div>
        )}
      </div>
    </NodeViewWrapper>
  )
}

export default VideoComponent
