import { useState } from 'react'

export default function TablePreview({ rows = [] }) {
  // 字段中英文映射
  const headerMap = {
    source: '来源',
    time: '时间',
    merchant: '商户',
    item: '商品',
    type: '收支类型',
    amount: '金额',
    channel: '支付渠道',
    status: '状态',
    note: '备注'
  }

  const head = Object.keys(rows[0] || {})
  const show = rows.slice(0, 50)

  // 记录每列宽度
  const [colWidths, setColWidths] = useState({})

  if (!rows.length) return null

  // 拖拽调整列宽
  const handleMouseDown = (e, key) => {
    e.preventDefault()
    const startX = e.clientX
    const startWidth = e.target.parentElement.offsetWidth

    const onMouseMove = e2 => {
      const newWidth = Math.max(50, startWidth + e2.clientX - startX)
      setColWidths(w => ({ ...w, [key]: newWidth }))
    }

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  return (
    <div className="mt-6 overflow-auto rounded-xl border border-zinc-200 bg-white shadow">
      <table className="min-w-full text-sm">
        <thead className="bg-zinc-50 text-zinc-600 font-bold">
          <tr>
            {head.map(k => (
              <th
                key={k}
                style={{ width: colWidths[k], minWidth: colWidths[k] }}
                className={`relative px-3 py-2 whitespace-nowrap border-r border-zinc-200 last:border-r-0 ${
                  k === 'merchant' || k === 'item' ? 'text-center' : 'text-left'
                }`}
              >
                {headerMap[k] || k}
                <div
                  onMouseDown={e => handleMouseDown(e, k)}
                  className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-transparent hover:bg-blue-400"
                ></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {show.map((r, i) => (
            <tr key={i} className="odd:bg-white even:bg-zinc-50">
              {head.map(k => (
                <td
                  key={k}
                  style={{ width: colWidths[k], minWidth: colWidths[k] }}
                  className={`px-3 py-2 whitespace-nowrap border-r border-zinc-200 last:border-r-0 ${
                    k === 'merchant' || k === 'item' ? 'text-center' : ''
                  }`}
                >
                  {String(r[k] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-3 py-2 text-xs text-zinc-500">
        仅展示前 50 条，共 {rows.length} 条
      </div>
    </div>
  )
}
