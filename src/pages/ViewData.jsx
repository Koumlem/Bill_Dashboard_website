import { useEffect, useRef, useState } from 'react'

export default function ViewData() {
  const [txns, setTxns] = useState([])
  const [editing, setEditing] = useState({ index: null, field: null })
  const [tags, setTags] = useState([])
  const [tagModal, setTagModal] = useState({ index: null })
  const [selectedTags, setSelectedTags] = useState([])
  const [newTagName, setNewTagName] = useState('')
  const [newTagColor, setNewTagColor] = useState('#000000')
  const topRef = useRef(null)
  const bodyRef = useRef(null)
  const tableRef = useRef(null)

  // 默认列宽
  const defaultWidths = {
    time: 140,
    merchant: 200,
    amount: 140,
    item: 200,
    type: 140,
    channel: 150,
    tags: 200,
    status: 140,
    note: 140
  }
  const [colWidths, setColWidths] = useState(defaultWidths)

  useEffect(() => {
    const saved = localStorage.getItem('transactions')
    if (saved) {
      const data = JSON.parse(saved)
      data.sort((a, b) => new Date(b.time) - new Date(a.time))
      setTxns(data)
    }
    const savedTags = localStorage.getItem('tags')
    if (savedTags) {
      setTags(JSON.parse(savedTags))
    }
  }, [])

  useEffect(() => {
    const top = topRef.current
    const body = bodyRef.current
    if (!top || !body) return
    const syncTop = () => {
      top.scrollLeft = body.scrollLeft
    }
    const syncBody = () => {
      body.scrollLeft = top.scrollLeft
    }
    body.addEventListener('scroll', syncTop)
    top.addEventListener('scroll', syncBody)
    return () => {
      body.removeEventListener('scroll', syncTop)
      top.removeEventListener('scroll', syncBody)
    }
  }, [])

  useEffect(() => {
    if (tableRef.current && topRef.current) {
      const width = tableRef.current.scrollWidth
      topRef.current.firstChild.style.width = `${width}px`
    }
  }, [txns, colWidths])

  const handleCellClick = (index, field) => {
    if (field === 'tags') {
      setSelectedTags(txns[index].tags || [])
      setTagModal({ index })
    } else {
      setEditing({ index, field })
    }
  }

  const handleCellChange = (index, field, value) => {
    setTxns(prev => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const handleBlur = () => {
    setEditing({ index: null, field: null })
    localStorage.setItem('transactions', JSON.stringify(txns))
  }

  const handleClearRefund = () => {
    const filtered = txns.filter(t => !String(t.status).includes('退款'))
    filtered.sort((a, b) => new Date(b.time) - new Date(a.time))
    setTxns(filtered)
    localStorage.setItem('transactions', JSON.stringify(filtered))
  }

  const handleResetData = () => {
    setTxns([])
    localStorage.removeItem('transactions')
  }

  const handleAddTag = () => {
    if (!newTagName.trim()) return
    const updated = [...tags, { name: newTagName.trim(), color: newTagColor }]
    setTags(updated)
    localStorage.setItem('tags', JSON.stringify(updated))
    setNewTagName('')
  }

  const toggleSelectTag = name => {
    setSelectedTags(prev =>
      prev.includes(name) ? prev.filter(t => t !== name) : [...prev, name]
    )
  }

  const handleSaveTags = () => {
    setTxns(prev => {
      const next = [...prev]
      next[tagModal.index] = { ...next[tagModal.index], tags: selectedTags }
      localStorage.setItem('transactions', JSON.stringify(next))
      return next
    })
    setTagModal({ index: null })
  }

  // 拖拽调整列宽
  const handleMouseDown = (e, key) => {
    e.preventDefault()
    const startX = e.clientX
    const startWidth = colWidths[key]

    const onMouseMove = e2 => {
      const newWidth = Math.max(60, startWidth + e2.clientX - startX)
      setColWidths(w => ({ ...w, [key]: newWidth }))
    }

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const fields = [
    'time',
    'merchant',
    'amount',
    'item',
    'type',
    'channel',
    'tags',
    'status',
    'note'
  ]
  const headers = [
    '时间',
    '交易对方',
    '金额',
    '商品说明',
    '收/支',
    '收/付款方式',
    '标签',
    '交易状态',
    '备注'
  ]

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">查看数据</h2>
      <div className="mb-4 space-x-2">
        <button
          onClick={handleClearRefund}
          className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 rounded"
        >
          清除已退款数据
        </button>
        <button
          onClick={handleResetData}
          className="px-4 py-2 bg-red-200 hover:bg-red-300 rounded"
        >
          重置数据
        </button>
      </div>
      <div className="overflow-x-auto mb-2" ref={topRef}>
        <div className="h-4" />
      </div>
      <div
        className="overflow-y-auto overflow-x-hidden rounded border border-zinc-200 bg-white shadow max-h-[70vh]"
        ref={bodyRef}
      >
        <table ref={tableRef} className="text-sm">
          <thead className="bg-zinc-50 sticky top-0 z-10">
            <tr>
              {fields.map((f, i) => (
                <th
                  key={f}
                  style={{ width: colWidths[f], minWidth: colWidths[f], maxWidth: colWidths[f] }}
                  className={`relative px-3 py-2 border-r border-zinc-200 last:border-r-0 break-words ${
                    f === 'time' ? 'text-left' : 'text-center'
                  }`}
                >
                  {headers[i]}
                  <div
                    onMouseDown={e => handleMouseDown(e, f)}
                    className="absolute right-0 top-0 h-full w-1 cursor-col-resize select-none"
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {txns.map((r, idx) => (
              <tr key={idx} className="odd:bg-white even:bg-zinc-50">
                {fields.map(f => (
                  <td
                    key={f}
                    style={{ width: colWidths[f], minWidth: colWidths[f], maxWidth: colWidths[f] }}
                    className={`px-3 py-2 border-r border-zinc-200 last:border-r-0 cursor-pointer break-words ${
                      ['amount', 'type', 'status'].includes(f) ? 'text-center' : ''
                    }`}
                    onClick={() => handleCellClick(idx, f)}
                  >
                    {f === 'tags' ? (
                      r.tags && r.tags.length ? (
                        r.tags.map(tagName => {
                          const tag = tags.find(t => t.name === tagName)
                          return (
                            <span
                              key={tagName}
                              className="inline-block px-1 mr-1 rounded text-white text-xs"
                              style={{ backgroundColor: tag?.color || '#999' }}
                            >
                              {tagName}
                            </span>
                          )
                        })
                      ) : (
                        <span className="text-zinc-400">+</span>
                      )
                    ) : editing.index === idx && editing.field === f ? (
                      <input
                        value={txns[idx][f] || ''}
                        onChange={e => handleCellChange(idx, f, e.target.value)}
                        onBlur={handleBlur}
                        autoFocus
                        className="w-full border rounded px-1"
                      />
                    ) : f === 'amount' ? (
                      <span
                        className={
                          r.type?.includes('支出')
                            ? 'text-red-600'
                            : r.type?.includes('收入')
                              ? 'text-green-600'
                              : 'text-purple-600'
                        }
                      >
                        {txns[idx][f] || ''}
                      </span>
                    ) : (
                      txns[idx][f] || ''
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {tagModal.index !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded p-4 w-72 space-y-2">
            <div className="max-h-40 overflow-y-auto space-y-1">
              {tags.map(t => (
                <label key={t.name} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(t.name)}
                    onChange={() => toggleSelectTag(t.name)}
                  />
                  <span
                    className="inline-block w-3 h-3 rounded"
                    style={{ backgroundColor: t.color }}
                  />
                  <span>{t.name}</span>
                </label>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={newTagColor}
                onChange={e => setNewTagColor(e.target.value)}
              />
              <input
                type="text"
                value={newTagName}
                onChange={e => setNewTagName(e.target.value)}
                placeholder="标签名字"
                className="border rounded px-2 py-1 flex-1"
              />
              <button
                onClick={handleAddTag}
                className="px-2 py-1 bg-blue-500 text-white rounded"
              >
                添加
              </button>
            </div>
            <div className="text-right space-x-2 pt-2">
              <button
                onClick={handleSaveTags}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                保存
              </button>
              <button
                onClick={() => setTagModal({ index: null })}
                className="px-3 py-1 bg-zinc-200 rounded"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

