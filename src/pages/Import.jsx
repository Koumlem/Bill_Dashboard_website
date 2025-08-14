import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UploadBox from '../components/UploadBox'
import TablePreview from '../components/TablePreview'
import { processData } from '../utils/processData'

export default function ImportPage() {
  const [txns, setTxns] = useState([])
  const navigate = useNavigate()

  const handleParsed = (raw = []) => {
    const cleaned = processData(raw)
    // 将当前解析数据合并到已保存数据中，然后再更新预览
    const saved = JSON.parse(localStorage.getItem('transactions') || '[]')
    if (txns.length) {
      localStorage.setItem('transactions', JSON.stringify([...saved, ...txns]))
    }
    setTxns(cleaned)
  }

  const handleConfirmImport = () => {
    if (!txns.length) return alert('请先上传并解析账单')
    const saved = JSON.parse(localStorage.getItem('transactions') || '[]')
    const merged = [...saved, ...txns]
    localStorage.setItem('transactions', JSON.stringify(merged))
    setTxns([])
    navigate('/analysis')
  }

  return (
     <div className="p-6">
      {/* 欢迎卡片 */}
      <div className="bg-green-200/50 p-6 rounded-lg shadow-lg mb-6">
        <h1 className="text-2xl font-bold mb-2">欢迎使用账单导入工具</h1>
        <p className="text-gray-700">
          这里可以上传并解析你的微信和支付宝账单，点击下方区域拖拽或选择文件开始导入。
        </p>
      </div>
    <div className="w-full p-0">
      <h2 className="text-2xl font-bold mb-4 px-4 pt-4">账单导入</h2>
      <div className="px-4">
        <UploadBox onParsed={handleParsed} />
        <TablePreview rows={txns} />
        {txns.length > 0 && (
          <button
            onClick={handleConfirmImport}
            className="mt-4 px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded"
          >
            确定导入
          </button>
        )}
      </div>
    </div>
   </div>
  )
}
