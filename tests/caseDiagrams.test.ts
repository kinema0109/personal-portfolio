import { test } from 'node:test'
import assert from 'node:assert/strict'
import { CASES, CASE_IDS } from '../src/content/caseDiagrams.ts'

const STEPS = { cbpo: 2, 'cbpo-migration': 5, 'cbpo-mcp': 4, 'cbpo-cicd': 4, 'cbpo-shipping': 4, avotree: 5, singlekey: 4, yokara: 6, suzu: 4 }

test('every case has a diagram and one focus list per step', () => {
  assert.deepEqual([...CASE_IDS].sort(), Object.keys(STEPS).sort())
  for (const id of CASE_IDS) assert.equal(CASES[id].focus.length, STEPS[id], id)
})

test('every focus id and every edge end names a block or edge in the same diagram', () => {
  for (const id of CASE_IDS) {
    const { blocks, edges } = CASES[id].diagram
    const blockIds = new Set(blocks.map((b) => b.id))
    const ids = new Set([...blockIds, ...edges.map((e) => e.id)])
    assert.equal(ids.size, blocks.length + edges.length, `${id}: ids are unique`)
    for (const e of edges) {
      assert.ok(blockIds.has(e.from) && blockIds.has(e.to), `${id}: edge ${e.id} joins two blocks`)
    }
    for (const step of CASES[id].focus) {
      for (const f of step) assert.ok(ids.has(f), `${id}: focus ${f} exists`)
    }
  }
})

test('blocks sit on the 4 × 3 grid and never share a cell', () => {
  for (const id of CASE_IDS) {
    const cells = CASES[id].diagram.blocks.map((b) => `${b.col},${b.row}`)
    assert.equal(new Set(cells).size, cells.length, `${id}: no two blocks share a cell`)
    for (const b of CASES[id].diagram.blocks) {
      assert.ok(b.col >= 0 && b.col <= 3 && b.row >= 0 && b.row <= 2, `${id}: ${b.id} on the grid`)
      assert.ok(b.label.length <= 16 && (b.sub ?? '').length <= 18, `${id}: ${b.id} labels fit`)
    }
  }
})
