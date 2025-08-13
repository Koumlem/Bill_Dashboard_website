import test from 'node:test'
import assert from 'node:assert'
import { processData } from './processData.js'

test('processData returns empty array for null input', () => {
  assert.deepStrictEqual(processData(null), [])
})

test('processData formats date, parses amount and categorises', () => {
  const rows = [
    { time: '2024-01-02T00:00:00Z', amount: '12.50', merchant: '星巴克', item: '' },
  ]
  const [result] = processData(rows)
  assert.equal(result.time, '2024-01-02')
  assert.equal(result.amount, 12.5)
  assert.equal(result.category, '饮食')
})
