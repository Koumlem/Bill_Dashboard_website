// src/pages/Analysis.jsx
import { useEffect, useState } from 'react'

export default function Analysis() {
  const [txns, setTxns] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('transactions')
    if (saved) setTxns(JSON.parse(saved))
  }, [])

  // 总支出（取绝对值）
  const totalExpense = txns
    .filter(t => String(t.type).includes('支'))
    .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount || 0)), 0)

  // 总收入
  const totalIncome = txns
    .filter(t => String(t.type).includes('收'))
    .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount || 0)), 0)

  // 按商户聚合支出 Top 5
  const merchantStats = txns
    .filter(t => String(t.type).includes('支'))
    .reduce((acc, t) => {
      const key = t.merchant || '未分类'
      acc[key] = (acc[key] || 0) + Math.abs(parseFloat(t.amount || 0))
      return acc
    }, {})

  const topMerchants = Object.entries(merchantStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">消费分析</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-white shadow p-4 font-semibold">
          总支出：<span className="text-red-600">￥{totalExpense.toFixed(2)}</span>
        </div>
        <div className="rounded-xl bg-white shadow p-4 font-semibold">
          总收入：<span className="text-green-600">￥{totalIncome.toFixed(2)}</span>
        </div>
      </div>

      <h3 className="text-xl font-semibold mt-6 mb-2">支出最多的商户</h3>
      <ul className="list-disc pl-5">
        {topMerchants.map(([m, amt]) => (
          <li key={m} className="mb-1">
            {m} - ￥{amt.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  )
}
