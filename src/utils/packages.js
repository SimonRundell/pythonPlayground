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
]

/** Categories in display order. */
export const CATEGORIES = ['Science', 'Maths', 'Data', 'Media']

/**
 * Maps Python import-level names to curated package IDs.
 * Covers both `import X` and `from X import …` top-level names.
 */
export const IMPORT_TO_PACKAGE_ID = {
  numpy:      'numpy',
  pandas:     'pandas',
  matplotlib: 'matplotlib',
  scipy:      'scipy',
  sklearn:    'scikit-learn',
  sympy:      'sympy',
  PIL:        'pillow',
  openpyxl:   'openpyxl',
  networkx:   'networkx',
}

/**
 * Scan Python source for import statements and return the IDs of curated
 * packages that are referenced but not yet installed.
 *
 * @param {string}      code             - Python source code
 * @param {Set<string>} installedPackages - currently installed package IDs
 * @returns {string[]} package IDs that need to be installed
 */
export function detectMissingPackages(code, installedPackages) {
  const re = /^[ \t]*(?:import[ \t]+([\w.]+)|from[ \t]+([\w.]+)[ \t]+import)/gm
  const topLevelNames = new Set()
  let m
  while ((m = re.exec(code)) !== null) {
    topLevelNames.add((m[1] || m[2]).split('.')[0])
  }
  return [...topLevelNames]
    .map((name) => IMPORT_TO_PACKAGE_ID[name])
    .filter((id) => id !== undefined && !installedPackages.has(id))
}
