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

  // 图表视图：年视图 或 月视图，暂时只实现月视图
  const [viewType, setViewType] = useState('month')
  // 当前选择的月份，格式 yyyy-MM
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date()
    return d.toISOString().slice(0, 7)
  })

  useEffect(() => {
    const saved = localStorage.getItem('transactions')
    if (saved) setTxns(JSON.parse(saved))
    const savedTags = localStorage.getItem('tags')
    const t = savedTags ? JSON.parse(savedTags) : []
    const defaultList = [
      ...t,
      { name: '总支出', color: '#ef4444' },
      { name: '总收入', color: '#22c55e' }
    ]
    setTags(defaultList)
    setSelectedTags(['总支出', '总收入'])
  }, [])

  // 按日期过滤
  const dateFiltered = txns.filter(t => {
    if (dateMode === 'all') return true
    const d = new Date(t.time)
    if (startDate && d < new Date(startDate)) return false
    if (endDate && d > new Date(endDate)) return false
    return true
  })

  // 若选择月视图，则只保留当前选择月份的数据
  const periodFiltered =
    viewType === 'month'
      ? dateFiltered.filter(t => {
          if (!t.time) return false
          const d = new Date(t.time)
          const [y, m] = selectedMonth.split('-').map(Number)
          return d.getFullYear() === y && d.getMonth() + 1 === m
        })
      : dateFiltered

  // 计算该时间段内的总支出和总收入
  const totalExpense = periodFiltered
    .filter(t => String(t.type).includes('支'))
    .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount || 0)), 0)

  const totalIncome = periodFiltered
    .filter(t => String(t.type).includes('收'))
    .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount || 0)), 0)

  // 根据支出/收入选择过滤
  const typeFiltered = periodFiltered.filter(t =>
    displayType === '支出'
      ? String(t.type).includes('支')
      : String(t.type).includes('收')
  )

  const dateAmounts = {}
  periodFiltered.forEach(t => {
    const d = t.time ? t.time.slice(0, 10) : ''
    if (!d) return
    if (!dateAmounts[d]) dateAmounts[d] = { '总支出': 0, '总收入': 0 }
    const tagNames = t.tags && t.tags.length ? t.tags : ['未分类']
    const amount = Math.abs(parseFloat(t.amount || 0))
    if (String(t.type).includes('支')) {
      dateAmounts[d]['总支出'] += amount
    } else if (String(t.type).includes('收')) {
      dateAmounts[d]['总收入'] += amount
    }
    tagNames.forEach(name => {
      dateAmounts[d][name] = (dateAmounts[d][name] || 0) + amount
    })
  })
  let sortedDates
  let daysInMonth = 31
  if (viewType === 'month') {
    const [y, m] = selectedMonth.split('-').map(Number)
    daysInMonth = new Date(y, m, 0).getDate()
    sortedDates = Array.from({ length: daysInMonth }, (_, i) =>
      `${selectedMonth}-${String(i + 1).padStart(2, '0')}`
    )
  } else {
    sortedDates = Object.keys(dateAmounts).sort(
      (a, b) => new Date(a) - new Date(b)
    )
  }
  const chartData = sortedDates.map(d => ({
    date: d,
    '总支出': 0,
    '总收入': 0,
    ...(dateAmounts[d] || {})
  }))
  const chartWidth = 600
  const innerWidth = chartWidth - 80
  const spacing = innerWidth / Math.max(chartData.length - 1, 1)
  const maxTxnAmount = periodFiltered
    .filter(t => String(t.type).includes('支'))
    .reduce(
      (max, t) => Math.max(max, Math.abs(parseFloat(t.amount || 0))),
      0
    )
  const base = maxTxnAmount / 4
  let unit
  if (base < 10) unit = 10
  else if (base < 50) unit = 50
  else if (base < 150) unit = 50
  else if (base < 500) unit = 500
  else if (base < 1000) unit = 1000
  else unit = 1000
  const yMax = unit * 4

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
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-2 text-sm">
          <button
            onClick={() => setViewType('year')}
            className={`px-3 py-1 rounded ${
              viewType === 'year'
                ? 'bg-blue-500 text-white'
                : 'bg-zinc-200 text-zinc-700'
            }`}
          >
            年视图
          </button>
          <button
            onClick={() => setViewType('month')}
            className={`px-3 py-1 rounded ${
              viewType === 'month'
                ? 'bg-blue-500 text-white'
                : 'bg-zinc-200 text-zinc-700'
            }`}
          >
            月视图
          </button>
        </div>
        {viewType === 'month' && (
          <input
            type="month"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
        )}
      </div>
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
      <div className="w-full">
        <svg viewBox={`0 0 ${chartWidth} 250`} width="100%" height={250}>
          <line x1="40" y1="200" x2={chartWidth - 40} y2="200" stroke="#000" />
          <line x1="40" y1="20" x2="40" y2="200" stroke="#000" />
          {[0, 1, 2, 3, 4].map(i => {
            const y = 200 - (i * 180) / 4
            return (
              <g key={i}>
                <line
                  x1="40"
                  y1={y}
                  x2={chartWidth - 40}
                  y2={y}
                  stroke="#facc15"
                />
                <text
                  x="10"
                  y={y + 4}
                  fontSize="10"
                  fill="#facc15"
                >
                  {unit * i}
                </text>
              </g>
            )
          })}
          {selectedTags.map(name => {
            const color = tags.find(t => t.name === name)?.color || '#000'
            const points = chartData
              .map((d, i) => {
                const x = i * spacing + 40
                const y = 200 - ((d[name] || 0) / (yMax || 1)) * 180
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
            const x = i * spacing + 40
            const dateObj = new Date(d.date)
            const day = dateObj.getDate()
            const isSunday = dateObj.getDay() === 0
            const isSpecial = day === 1 || day === 15 || day === daysInMonth
            if (viewType !== 'month') {
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
            }
            return (
              <g key={d.date}>
                {isSunday && (
                  <text x={x} y={12} textAnchor="middle" fontSize="10">
                    Sun.
                  </text>
                )}
                {isSpecial && (
                  <text x={x} y={215} textAnchor="middle" fontSize="10">
                    {day}
                  </text>
                )}
              </g>
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

