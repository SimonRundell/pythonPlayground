/**
 * @file packages.js - Curated list of installable packages for Python Playground.
 *
 * pyodide:true  → loaded via pyodide.loadPackage() (pre-compiled WASM, fast)
 * pyodide:false → loaded via micropip.install() (pure-Python wheel from PyPI)
 *
 * @license Creative Commons BY-NC-SA 4.0 - Simon Rundell
 */

/** @type {Array<{id:string, name:string, description:string, category:string, pyodide:boolean}>} */
export const CURATED_PACKAGES = [
  {
    id: 'numpy',
    name: 'NumPy',
    description: 'Arrays and numerical computing',
    category: 'Science',
    pyodide: true,
  },
  {
    id: 'pandas',
    name: 'Pandas',
    description: 'Data analysis and DataFrames',
    category: 'Science',
    pyodide: true,
  },
  {
    id: 'matplotlib',
    name: 'Matplotlib',
    description: 'Charts and plotting (output appears in Graphics tab)',
    category: 'Science',
    pyodide: true,
  },
  {
    id: 'scipy',
    name: 'SciPy',
    description: 'Scientific algorithms and statistics',
    category: 'Science',
    pyodide: true,
  },
  {
    id: 'sympy',
    name: 'SymPy',
    description: 'Symbolic mathematics and algebra',
    category: 'Maths',
    pyodide: true,
  },
  {
    id: 'scikit-learn',
    name: 'scikit-learn',
    description: 'Machine learning algorithms',
    category: 'Science',
    pyodide: true,
  },
  {
    id: 'pillow',
    name: 'Pillow',
    description: 'Image processing (PIL)',
    category: 'Media',
    pyodide: true,
  },
  {
    id: 'openpyxl',
    name: 'OpenPyXL',
    description: 'Read and write Excel files',
    category: 'Data',
    pyodide: true,
  },
  {
    id: 'networkx',
    name: 'NetworkX',
    description: 'Graph and network algorithms',
    category: 'Science',
    pyodide: true,
  },
  {
    id: 'bokeh',
    name: 'Bokeh',
    description: 'Interactive web charts',
    category: 'Science',
    pyodide: true,
  },
]

/** Categories in display order. */
export const CATEGORIES = ['Science', 'Maths', 'Data', 'Media']
