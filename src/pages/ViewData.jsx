import { useEffect, useState } from 'react'

export default function ViewData() {
  const [txns, setTxns] = useState([])
  const [editing, setEditing] = useState({ index: null, field: null })

  useEffect(() => {
    const saved = localStorage.getItem('transactions')
    if (saved) {
      const data = JSON.parse(saved)
      data.sort((a, b) => new Date(b.time) - new Date(a.time))
      setTxns(data)
    }
  }, [])

  const handleCellClick = (index, field) => {
    setEditing({ index, field })
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
    setTxns(filtered)
    localStorage.setItem('transactions', JSON.stringify(filtered))
  }

  // 按日期分组
  const groups = []
  txns.forEach((txn, idx) => {
    const date = txn.time || ''
    let group = groups.find(g => g.date === date)
    if (!group) {
      group = { date, rows: [] }
      groups.push(group)
    }
    group.rows.push({ ...txn, _idx: idx })
  })
  groups.sort((a, b) => new Date(b.date) - new Date(a.date))

  const fields = ['time', 'merchant', 'item', 'type', 'channel', 'status', 'note']
  const headers = ['时间', '交易对方', '商品说明', '收/支', '收/付款方式', '交易状态', '备注']

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">查看数据</h2>
      <button
        onClick={handleClearRefund}
        className="mb-4 px-4 py-2 bg-zinc-200 hover:bg-zinc-300 rounded"
      >
        清除已退款数据
      </button>
      {groups.map(g => (
        <div key={g.date} className="mb-6">
          <h3 className="font-semibold mb-2">{g.date}</h3>
          <div className="overflow-auto rounded border border-zinc-200 bg-white shadow">
            <table className="min-w-full text-sm">
              <thead className="bg-zinc-50">
                <tr>
                  {headers.map(h => (
                    <th key={h} className="px-3 py-2 whitespace-nowrap text-left">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {g.rows.map(r => (
                  <tr key={r._idx} className="odd:bg-white even:bg-zinc-50">
                    {fields.map(f => (
                      <td
                        key={f}
                        className="px-3 py-2 whitespace-nowrap cursor-pointer"
                        onClick={() => handleCellClick(r._idx, f)}
                      >
                        {editing.index === r._idx && editing.field === f ? (
                          <input
                            value={txns[r._idx][f] || ''}
                            onChange={e => handleCellChange(r._idx, f, e.target.value)}
                            onBlur={handleBlur}
                            autoFocus
                            className="w-full border rounded px-1"
                          />
                        ) : (
                          txns[r._idx][f] || ''
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}
