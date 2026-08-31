import { readFile } from 'node:fs/promises'

const path = new URL('../design/yor-tokens.json', import.meta.url)
const tokens = JSON.parse(await readFile(path, 'utf8'))
const requiredColors = {
  void: '#000000',
  graphite: '#050505',
  crimson: '#e84b4b',
  deepCrimson: '#671515',
  warmAccent: '#ff8a7f',
  warmWhite: '#f5eaea',
  muted: '#c4c4c4',
}

for (const [name, value] of Object.entries(requiredColors)) {
  if (tokens.colors?.[name] !== value) throw new Error(`YOR token mismatch: colors.${name} must be ${value}`)
}

const states = ['VERIFIED', 'REPORTED', 'DEMO', 'EXPERIMENTAL', 'PLANNED']
if (JSON.stringify(tokens.evidenceStates) !== JSON.stringify(states)) throw new Error('YOR evidence state vocabulary is incomplete or reordered')

process.stdout.write(`YOR token contract valid: ${path.pathname}\n`)
