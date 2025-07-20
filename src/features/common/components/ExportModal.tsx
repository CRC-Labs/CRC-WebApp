import { useState, useEffect } from "react"

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  pgnContent: string
  filename: string
  onDownload: (pgn: string, filename: string) => void
}

function ExportModal({
  isOpen,
  onClose,
  title,
  pgnContent,
  filename,
  onDownload,
}: ExportModalProps) {
  const [copyButtonState, setCopyButtonState] = useState<
    "copy" | "copied" | "error"
  >("copy")

  const handleCopyToClipboard = async () => {
    if (pgnContent) {
      try {
        await navigator.clipboard.writeText(pgnContent)
        setCopyButtonState("copied")

        setTimeout(() => {
          setCopyButtonState("copy")
        }, 2000)
      } catch (error) {
        setCopyButtonState("error")

        setTimeout(() => {
          setCopyButtonState("copy")
        }, 2000)
      }
    }
  }

  const handleDownload = () => {
    onDownload(pgnContent, filename)
    onClose()
  }

  // Reset copy button state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setCopyButtonState("copy")
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              PGN Output:
            </label>
            <textarea
              value={pgnContent || "Loading..."}
              readOnly
              className="w-full h-64 p-3 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono text-sm resize-none"
              style={{
                fontFamily: 'Monaco, Consolas, "Courier New", monospace',
              }}
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3">
            {/* Copy Button with Feedback */}
            <button
              onClick={handleCopyToClipboard}
              disabled={!pgnContent || copyButtonState !== "copy"}
              className={`
                px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-2
                ${
                  copyButtonState === "copy"
                    ? "text-gray-700 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                    : copyButtonState === "copied"
                      ? "text-green-700 bg-green-200 dark:bg-green-600 dark:text-green-100"
                      : "text-red-700 bg-red-200 dark:bg-red-600 dark:text-red-100"
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {copyButtonState === "copy" && (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy to Clipboard
                </>
              )}
              {copyButtonState === "copied" && (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Copied!
                </>
              )}
              {copyButtonState === "error" && (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Copy Failed
                </>
              )}
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={!pgnContent}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download as .pgn
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExportModal
