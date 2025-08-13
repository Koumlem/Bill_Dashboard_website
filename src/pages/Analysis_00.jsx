import { useState, useEffect } from 'react'

export default function Analysis() {
  const [txns, setTxns] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('transactions')
    if (saved) {
      setTxns(JSON.parse(saved))
    }
  }, [])

  // 总支出（负数取绝对值）
  const totalExpense = txns
    .filter(t => t.type.includes('支出'))
    .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount || 0)), 0)

  // 总收入
  const totalIncome = txns
    .filter(t => t.type.includes('收入'))
    .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount || 0)), 0)

  // 按商户分组支出排行
  const merchantStats = txns
    .filter(t => t.type.includes('支出'))
    .reduce((acc, t) => {
      const m = t.merchant || '未分类'
      acc[m] = (acc[m] || 0) + Math.abs(parseFloat(t.amount || 0))
      return acc
    }, {})

  const topMerchants = Object.entries(merchantStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">消费分析</h2>

      <div className="bg-green-100 p-4 rounded mb-4">
        <p className="font-bold">总支出：<span className="text-red-600">￥{totalExpense.toFixed(2)}</span></p>
        <p className="font-bold">总收入：<span className="text-green-600">￥{totalIncome.toFixed(2)}</span></p>
      </div>

      <h3 className="text-xl font-semibold mb-2">支出最多的商户</h3>
      <ul className="list-disc pl-5">
        {topMerchants.map(([merchant, amount]) => (
          <li key={merchant} className="mb-1">
            {merchant} - ￥{amount.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  )
}
