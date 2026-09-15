/**
 * @file AlgorithmsDrawer.jsx - Algorithms reference drawer.
 *
 * Content is drawn from "The Little Book of Algorithms 2.0" by William Lau,
 * used under Creative Commons BY-NC-SA 4.0.
 * Original work © William Lau. Adapted for Python Playground by Simon Rundell.
 *
 * A thin wrapper around the shared TeachingDrawer — see that file for the
 * actual drawer/detail-modal implementation.
 *
 * @license Creative Commons BY-NC-SA 4.0 - Simon Rundell
 */
import TeachingDrawer from './TeachingDrawer'
import { ALGORITHMS, ALGORITHM_CATEGORIES } from '../utils/algorithms'

/** Maps each category name to a distinctive colour. */
const CATEGORY_COLOURS = {
  'Maths':          '#06b6d4',
  'Strings':        '#8b5cf6',
  'Iteration':      '#f97316',
  'Selection':      '#3b82f6',
  'Lists':          '#22c55e',
  'Searching':      '#64748b',
  'Number Systems': '#ec4899',
  'Files':          '#eab308',
}

/**
 * @param {object}   props
 * @param {boolean}  props.isOpen
 * @param {() => void} props.onClose
 * @param {(code: string) => void} props.onLoadCode
 */
function AlgorithmsDrawer({ isOpen, onClose, onLoadCode }) {
  return (
    <TeachingDrawer
      isOpen={isOpen}
      onClose={onClose}
      onLoadCode={onLoadCode}
      items={ALGORITHMS}
      categories={ALGORITHM_CATEGORIES}
      categoryColours={CATEGORY_COLOURS}
      icon="📚"
      title="Algorithms"
      subtitle={<>From <em>The Little Book of Algorithms 2.0</em> by William Lau</>}
      searchPlaceholder="Search algorithms…"
      emptyMessage="No algorithms match your search."
      ariaLabel="Algorithms reference drawer"
      footer={
        <>
          <p>
            Content from <strong>The Little Book of Algorithms 2.0</strong>{' '}
            by <strong>William Lau</strong>, used under{' '}
            <a
              href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
              target="_blank"
              rel="noopener noreferrer"
            >
              CC BY-NC-SA 4.0
            </a>.
          </p>
          <p>Python Playground © 2026 Simon Rundell — CC BY-NC-SA 4.0</p>
        </>
      }
    />
  )
}

export default AlgorithmsDrawer
