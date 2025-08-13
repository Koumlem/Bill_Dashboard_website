import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ImportPage from './pages/Import'
import Analysis from './pages/Analysis'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ImportPage />} />
          <Route path="/analysis" element={<Analysis />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
