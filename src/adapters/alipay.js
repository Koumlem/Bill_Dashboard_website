import Papa from 'papaparse'

// 支付宝账单解析
export async function parseAlipayCSV(file) {
  const buf = await file.arrayBuffer()
  const csvText = new TextDecoder('gbk').decode(buf)

  const lines = csvText.split(/\r?\n/)
  const headIndex = lines.findIndex(l => l.startsWith('交易时间,'))
  if (headIndex < 0) throw new Error('未找到支付宝表头')

  const dataText = lines.slice(headIndex).join('\n')
  const parsed = Papa.parse(dataText, { header: true, skipEmptyLines: true })
  const rows = parsed.data

  const out = []
  for (const r of rows) {
    if (!r['交易时间']) continue

    const rawAmount = String(r['金额'] ?? '').replace(/[,]/g, '')
    const isExpense = String(r['收/支']).includes('支')
    const amount = (Number(rawAmount) || 0) * (isExpense ? -1 : 1)

    out.push({
      source: 'alipay',
      time: r['交易时间'],
      merchant: r['交易对方'],
      item: r['商品说明'],
      type: r['收/支'],
      amount,
      channel: r['收/付款方式'],
      status: r['交易状态'],
      note: r['备注']
    })
  }
  return out
}
