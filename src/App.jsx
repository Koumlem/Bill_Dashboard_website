import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ImportPage from './pages/Import'
import Analysis from './pages/Analysis'
import ViewData from './pages/ViewData'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ImportPage />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/view-data" element={<ViewData />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
