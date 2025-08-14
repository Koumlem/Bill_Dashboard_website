// src/pages/Analysis.jsx
import { useEffect, useState } from 'react'

export default function Analysis() {
  const [txns, setTxns] = useState([])

  // 日期筛选模式：all 或 range
  const [dateMode, setDateMode] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // 显示类型：支出 或 收入
  const [displayType, setDisplayType] = useState('支出')

  useEffect(() => {
    const saved = localStorage.getItem('transactions')
    if (saved) setTxns(JSON.parse(saved))
  }, [])

  // 按日期过滤
  const dateFiltered = txns.filter(t => {
    if (dateMode === 'all') return true
    const d = new Date(t.time)
    if (startDate && d < new Date(startDate)) return false
    if (endDate && d > new Date(endDate)) return false
    return true
  })

  // 计算该时间段内的总支出和总收入
  const totalExpense = dateFiltered
    .filter(t => String(t.type).includes('支'))
    .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount || 0)), 0)

  const totalIncome = dateFiltered
    .filter(t => String(t.type).includes('收'))
    .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount || 0)), 0)

  // 根据支出/收入选择过滤
  const typeFiltered = dateFiltered.filter(t =>
    displayType === '支出'
      ? String(t.type).includes('支')
      : String(t.type).includes('收')
  )

  // 取金额最大的前五条记录
  const topTxns = [...typeFiltered]
    .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
    .slice(0, 5)

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">消费分析</h2>

      {/* 日期筛选 */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="font-medium">日期筛选：</span>
        <label className="inline-flex items-center gap-1">
          <input
            type="radio"
            name="dateMode"
            value="all"
            checked={dateMode === 'all'}
            onChange={() => setDateMode('all')}
          />
          全部
        </label>
        <label className="inline-flex items-center gap-1">
          <input
            type="radio"
            name="dateMode"
            value="range"
            checked={dateMode === 'range'}
            onChange={() => setDateMode('range')}
          />
          自定义
        </label>
        {dateMode === 'range' && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="rounded border px-2 py-1"
            />
            <span>至</span>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="rounded border px-2 py-1"
            />
          </div>
        )}
      </div>

      {/* 支出/收入筛选 */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setDisplayType('支出')}
          className={`px-4 py-2 rounded font-medium ${
            displayType === '支出'
              ? 'bg-red-500 text-white'
              : 'bg-zinc-200 text-zinc-700'
          }`}
        >
          支出
        </button>
        <button
          onClick={() => setDisplayType('收入')}
          className={`px-4 py-2 rounded font-medium ${
            displayType === '收入'
              ? 'bg-green-500 text-white'
              : 'bg-zinc-200 text-zinc-700'
          }`}
        >
          收入
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-white shadow p-4 font-semibold">
          总支出：<span className="text-red-600">￥{totalExpense.toFixed(2)}</span>
        </div>
        <div className="rounded-xl bg-white shadow p-4 font-semibold">
          总收入：<span className="text-green-600">￥{totalIncome.toFixed(2)}</span>
        </div>
      </div>

      <h3 className="text-xl font-semibold mt-6 mb-2">{displayType}最多的五项记录</h3>
      <div className="space-y-2">
        {topTxns.map((t, i) => (
          <div
            key={i}
            className={`rounded-lg p-4 ${
              displayType === '支出' ? 'bg-red-500/50' : 'bg-green-500/50'
            }`}
          >
            <div>{t.item || '未命名'}</div>
            <div>{t.merchant || '未分类'}</div>
            <div>{t.time || ''}</div>
            <div>￥{Math.abs(t.amount || 0).toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

