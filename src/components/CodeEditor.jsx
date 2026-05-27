/**
 * @file CodeEditor.jsx - Monaco-based Python code editor.
 * @license Creative Commons BY-NC-SA 4.0 - Simon Rundell
 */
import MonacoEditor from '@monaco-editor/react'

/**
 * @param {object} props
 * @param {string}            props.value     - Current code string
 * @param {(v: string) => void} props.onChange - Called on every edit
 * @param {() => void}        props.onRun     - Called when Ctrl+Enter is pressed
 */
function CodeEditor({ value, onChange, onRun }) {
  function handleMount(editor, monaco) {
    // Ctrl+Enter triggers Run
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, onRun)

    // Remove the built-in formatDocument from Ctrl+Shift+F if present
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF,
      () => {}
    )
  }

  return (
    <MonacoEditor
      height="100%"
      language="python"
      theme="vs-dark"
      value={value}
      onChange={(v) => onChange(v ?? '')}
      onMount={handleMount}
      options={{
        fontFamily: "'Courier New', monospace",
        fontSize: 14,
        lineHeight: 21,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        automaticLayout: true,
        tabSize: 4,
        insertSpaces: true,
        suggestOnTriggerCharacters: true,
        quickSuggestions: true,
        renderLineHighlight: 'line',
        bracketPairColorization: { enabled: true },
      }}
    />
  )
}

export default CodeEditor
