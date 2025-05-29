import React from 'react'
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react'

const SectionCardComponent: React.FC<NodeViewProps> = ({
    node,
    getPos,
    editor
}) => {

    const handleEdit = () => {
        console.log('Edit section:', node.attrs.title)
        toggleEditable()
    }

    const [isEditable, setIsEditable] = React.useState(false)

    const toggleEditable = () => {
        setIsEditable(!isEditable)
        if (!isEditable) {
            editor.commands.setNodeSelection(getPos())
        } else {
            editor.commands.blur()
        }
    }

    const handleLog = () => {
        console.log(editor.getHTML())
    }

    return (
        <NodeViewWrapper className="section-card-wrapper">
            <div data-drag-handle contentEditable={isEditable} className="bg-gray-100 rounded-lg border border-gray-300 shadow-sm mb-4 p-4 overflow-hidden not-prose">
                <h3 className="text-xl text-gray-900 font-semibold mb-4">{node.attrs.title}</h3>              <div className="relative bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
                    <div className="flex items-start justify-between">                      <div className="p-2 prose prose-sm max-w-none text-gray-900">
                        <div
                            dangerouslySetInnerHTML={{
                                __html: node.attrs.content
                            }}
                        />
                    </div>

                    <button onClick={handleLog}>
                        log
                    </button>

                        <button
                            onClick={handleEdit}
                            type="button"
                            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0">
                            <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M30.5638 19.1634C25.411 18.6669 21.3336 14.5915 20.8377 9.44304L20.001 0.749573L19.1642 9.44304C18.6683 14.5924 14.591 18.6678 9.43814 19.1634L0.750977 19.9996L9.43814 20.8357C14.591 21.3322 18.6683 25.4076 19.1642 30.5561L20.001 39.2496L20.8377 30.5561C21.3336 25.4067 25.411 21.3313 30.5638 20.8357L39.251 19.9996L30.5638 19.1634Z"
                                    fill="#613EEA"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </NodeViewWrapper>
    )
}

export default SectionCardComponent
