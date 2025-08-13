import * as XLSX from 'xlsx'

export async function parseWechatXLSX(file) {
  const data = await file.arrayBuffer()
  const wb = XLSX.read(data, { type: 'array' })
  const ws = wb.Sheets[wb.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false })

  // 找到包含 "交易时间" 的行作为表头
  const headerRowIndex = rows.findIndex(r =>
    r.some(c => String(c).includes('交易时间'))
  )
  if (headerRowIndex < 0) throw new Error('未找到微信表头')

  const colNames = rows[headerRowIndex]
  const dataRows = rows.slice(headerRowIndex + 1)

  const idx = keyword => colNames.findIndex(c => String(c).includes(keyword))

  const out = []
  for (const r of dataRows) {
    if (!r || !r[idx('交易时间')]) continue

    const rawAmount = String(r[idx('金额')]).replace(/[¥,]/g, '')
    const isExpense = String(r[idx('收/支')]).includes('支')
    const amount = (Number(rawAmount) || 0) * (isExpense ? -1 : 1)

    out.push({
      source: 'wechat',
      time: r[idx('交易时间')],
      merchant: r[idx('交易对方')],
      item: r[idx('商品')],
      type: r[idx('收/支')],
      amount,
      channel: r[idx('支付方式')],
      status: r[idx('当前状态')],
      note: r[idx('备注')]
    })
  }
  return out
}
