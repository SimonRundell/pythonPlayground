/**
 * @file fileHandling.js - Multi-file load/save helpers using JSZip.
 *
 * Supports single files (.py, .csv, .json, .txt) and ZIP archives.
 * ZIP archives are used when the workspace contains more than one file.
 *
 * @license Creative Commons BY-NC-SA 4.0 - Simon Rundell
 */
import JSZip from 'jszip'

/** File extensions accepted by the file picker. */
const ACCEPT = '.py,.csv,.json,.txt,.zip'

/** Map a filename to a Monaco language identifier. */
export function languageForFile(filename) {
  if (filename.endsWith('.py'))   return 'python'
  if (filename.endsWith('.json')) return 'json'
  return 'plaintext'
}

/**
 * Open a file picker and load one or more files from disk.
 *
 * Single files (.py / .csv / .json / .txt) → returns one entry.
 * ZIP files → returns all text entries inside the archive.
 *
 * @returns {Promise<Array<{filename:string, content:string}>>}
 *   Resolves to an array of loaded files (empty if cancelled).
 */
export async function loadFiles() {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = ACCEPT

    input.onchange = async (e) => {
      const file = e.target.files[0]
      if (!file) return resolve([])

      if (file.name.toLowerCase().endsWith('.zip')) {
        try {
          const zip = await JSZip.loadAsync(file)
          const results = []
          for (const [path, entry] of Object.entries(zip.files)) {
            if (entry.dir) continue
            // Skip macOS metadata folders and hidden files
            if (path.includes('__MACOSX') || path.split('/').pop().startsWith('.')) continue
            try {
              const content = await entry.async('string')
              // Flatten directory paths — keep only the basename
              const basename = path.split('/').pop()
              results.push({ filename: basename, content })
            } catch (_) {
              // Skip non-text / binary entries
            }
          }
          resolve(results)
        } catch (err) {
          console.error('ZIP load failed:', err)
          resolve([])
        }
      } else {
        const content = await file.text()
        resolve([{ filename: file.name, content }])
      }
    }

    input.oncancel = () => resolve([])
    input.click()
  })
}

/**
 * Save a single file to disk.
 * @param {string} content
 * @param {string} filename
 */
export function saveFile(content, filename) {
  const blob = new Blob([content], { type: 'text/plain' })
  _triggerDownload(blob, filename)
}

/**
 * Save multiple files to disk as a ZIP archive.
 * @param {{ [filename: string]: string }} filesObj
 * @param {string} zipName  Suggested download name (e.g. "project.zip")
 */
export async function saveFilesAsZip(filesObj, zipName = 'workspace.zip') {
  const zip = new JSZip()
  for (const [filename, content] of Object.entries(filesObj)) {
    zip.file(filename, content)
  }
  const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' })
  _triggerDownload(blob, zipName)
}

function _triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
