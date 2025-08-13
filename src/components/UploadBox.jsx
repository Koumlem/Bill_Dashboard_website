import { useState } from 'react'
import { parseWechatXLSX } from '../adapters/wechat'
import { parseAlipayCSV } from '../adapters/alipay'

export default function UploadBox({ onParsed }) {
  const [hint, setHint] = useState('拖拽或点击选择微信 xlsx / 支付宝 csv')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleFiles(files) {
    setError('')
    setBusy(true)
    try {
      const file = files[0]
      if (!file) return
      const name = file.name.toLowerCase()

      let txns = []
      if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
        txns = await parseWechatXLSX(file)
      } else if (name.endsWith('.csv')) {
        txns = await parseAlipayCSV(file)
      } else {
        throw new Error('仅支持 .xlsx/.xls/.csv')
      }

      onParsed?.(txns)
      setHint(`已解析 ${txns.length} 条记录`)
    } catch (e) {
      setError(e.message || String(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <label
      className="block rounded-2xl border-2 border-dashed border-zinc-300 bg-white/70 p-8 text-center cursor-pointer
                 hover:border-zinc-400 hover:bg-white transition"
      onDragOver={e => e.preventDefault()}
      onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
    >
      <input type="file" accept=".csv,.xlsx,.xls" className="hidden"
             onChange={e => handleFiles(e.target.files)} />
      <div className="text-zinc-700 font-semibold">{busy ? '解析中…' : hint}</div>
      {error && <div className="mt-2 text-red-600 text-sm">{error}</div>}
    </label>
  )
}
