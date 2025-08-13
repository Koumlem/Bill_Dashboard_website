export default function TablePreview({ rows = [] }) {
  if (!rows.length) return null

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

  return (
    <div className="mt-6 overflow-auto rounded-xl border border-zinc-200 bg-white shadow">
      <table className="min-w-full text-sm">
        <thead className="bg-zinc-50 text-zinc-600 font-bold">
          <tr>
            {head.map(k => (
              <th
                key={k}
                className={`px-3 py-2 whitespace-nowrap ${
                  k === 'merchant' || k === 'item' ? 'text-center' : 'text-left'
                }`}
              >
                {headerMap[k] || k}
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
                  className={`px-3 py-2 whitespace-nowrap ${
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
