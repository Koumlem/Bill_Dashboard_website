// src/pages/Analysis.jsx
import { useEffect, useState } from 'react'

export default function Analysis() {
  const [txns, setTxns] = useState([])
  const [tags, setTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([])

  // 日期筛选模式：all 或 range
  const [dateMode, setDateMode] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // 显示类型：支出 或 收入
  const [displayType, setDisplayType] = useState('支出')

  useEffect(() => {
    const saved = localStorage.getItem('transactions')
    if (saved) setTxns(JSON.parse(saved))
    const savedTags = localStorage.getItem('tags')
    if (savedTags) {
      const t = JSON.parse(savedTags)
      setTags(t)
      setSelectedTags(t.map(x => x.name))
    }
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

  const dateAmounts = {}
  typeFiltered.forEach(t => {
    const d = t.time ? t.time.slice(0, 10) : ''
    if (!d) return
    if (!dateAmounts[d]) dateAmounts[d] = {}
    const tagNames = t.tags && t.tags.length ? t.tags : ['未分类']
    const amount = Math.abs(parseFloat(t.amount || 0))
    tagNames.forEach(name => {
      dateAmounts[d][name] = (dateAmounts[d][name] || 0) + amount
    })
  })
  const sortedDates = Object.keys(dateAmounts).sort(
    (a, b) => new Date(a) - new Date(b)
  )
  const chartData = sortedDates.map(d => ({ date: d, ...dateAmounts[d] }))
  const chartWidth = chartData.length * 60 + 80
  const viewWidth = Math.min(chartWidth, 31 * 60 + 80)
  const maxAmount = Math.max(
    0,
    ...chartData.flatMap(d => tags.map(t => d[t.name] || 0))
  )

  const toggleTag = name => {
    setSelectedTags(prev =>
      prev.includes(name) ? prev.filter(t => t !== name) : [...prev, name]
    )
  }

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

    {/* 折线图 */}
    <div className="my-6">
      <div className="flex flex-wrap gap-4 mb-2">
        {tags.map(t => (
          <label key={t.name} className="flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              checked={selectedTags.includes(t.name)}
              onChange={() => toggleTag(t.name)}
            />
            <span
              className="inline-block w-3 h-3 rounded"
              style={{ backgroundColor: t.color }}
            />
            {t.name}
          </label>
        ))}
      </div>
      <div className="overflow-x-auto" style={{ width: viewWidth }}>
        <svg width={chartWidth} height={250}>
          <line x1="40" y1="200" x2={chartWidth - 40} y2="200" stroke="#000" />
          <line x1="40" y1="20" x2="40" y2="200" stroke="#000" />
          {selectedTags.map(name => {
            const color = tags.find(t => t.name === name)?.color || '#000'
            const points = chartData
              .map((d, i) => {
                const x = i * 60 + 40
                const y = 200 - ((d[name] || 0) / (maxAmount || 1)) * 180
                return `${x},${y}`
              })
              .join(' ')
            return (
              <polyline
                key={name}
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="2"
              />
            )
          })}
          {chartData.map((d, i) => {
            const x = i * 60 + 40
            return (
              <text
                key={d.date}
                x={x}
                y={215}
                textAnchor="middle"
                fontSize="10"
              >
                {d.date.slice(5)}
              </text>
            )
          })}
        </svg>
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

