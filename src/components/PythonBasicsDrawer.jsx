/**
 * @file PythonBasicsDrawer.jsx - Beginner-friendly, step-by-step Python
 * walkthrough drawer for absolute beginners (NCFE Level 2 and the early
 * stages of BTec/T-Level programming units).
 *
 * A thin wrapper around the shared TeachingDrawer — see that file for the
 * actual drawer/detail-modal implementation.
 *
 * @license Creative Commons BY-NC-SA 4.0 - Simon Rundell
 */
import TeachingDrawer from './TeachingDrawer'
import { BASICS_TOPICS, BASICS_CATEGORIES } from '../utils/pythonBasics'

/** Maps each category name to a distinctive colour. */
const CATEGORY_COLOURS = {
  'Basics':              '#0ea5e9',
  'Logic':               '#f97316',
  'Loops':               '#8b5cf6',
  'Collections':         '#22c55e',
  'Functions & Errors':  '#ef4444',
  'Files':               '#eab308',
  'Data Science':        '#ec4899',
}

/**
 * @param {object}   props
 * @param {boolean}  props.isOpen
 * @param {() => void} props.onClose
 * @param {(code: string) => void} props.onLoadCode
 */
function PythonBasicsDrawer({ isOpen, onClose, onLoadCode }) {
  return (
    <TeachingDrawer
      isOpen={isOpen}
      onClose={onClose}
      onLoadCode={onLoadCode}
      items={BASICS_TOPICS}
      categories={BASICS_CATEGORIES}
      categoryColours={CATEGORY_COLOURS}
      icon="🔰"
      title="Python Basics"
      subtitle="A step-by-step walkthrough for absolute beginners"
      searchPlaceholder="Search topics…"
      emptyMessage="No topics match your search."
      ariaLabel="Python Basics walkthrough drawer"
      footer={<p>Python Playground © 2026 Simon Rundell — CC BY-NC-SA 4.0</p>}
    />
  )
}

export default PythonBasicsDrawer
