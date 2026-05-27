/**
 * @file fileHandling.js - Load and save Python source files using the browser File API.
 * @license Creative Commons BY-NC-SA 4.0 - Simon Rundell
 */

/**
 * Opens a file picker and reads the selected .py file.
 * @returns {Promise<{content: string|null, filename: string}>}
 */
export async function loadFile() {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.py,text/plain'

    input.onchange = async (e) => {
      const file = e.target.files[0]
      if (!file) return resolve({ content: null, filename: '' })

      const content = await file.text()
      resolve({ content, filename: file.name })
    }

    input.oncancel = () => resolve({ content: null, filename: '' })
    input.click()
  })
}

/**
 * Triggers a browser download of the given code as a .py file.
 * @param {string} code - Python source to save.
 * @param {string} [filename='script.py'] - Suggested filename.
 */
export function saveFile(code, filename = 'script.py') {
  const blob = new Blob([code], { type: 'text/x-python' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
