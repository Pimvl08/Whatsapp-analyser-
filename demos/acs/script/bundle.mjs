// Bundles entry.js with the app's own src/lib/pdf.ts. Only the jspdf import
// from src/ is redirected to shim-jspdf.js; the app source itself is untouched.
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as esbuild from '../../../node_modules/esbuild/lib/main.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '../../..')
const shim = path.join(here, 'shim-jspdf.js')

await esbuild.build({
  entryPoints: [path.join(here, 'entry.js')],
  bundle: true,
  format: 'iife',
  outfile: path.join(here, 'bundle.js'),
  nodePaths: [path.join(root, 'node_modules')],
  plugins: [{
    name: 'jspdf-title-shim',
    setup(b) {
      b.onResolve({ filter: /^jspdf$/ }, (a) =>
        a.importer.startsWith(path.join(root, 'src') + path.sep) ? { path: shim } : undefined)
    },
  }],
  logLevel: 'info',
})
