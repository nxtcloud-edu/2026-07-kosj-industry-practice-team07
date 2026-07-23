import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Diagnosis from './pages/Diagnosis'
import Matching from './pages/Matching'
import BusinessPlan from './pages/BusinessPlan'
import Checklist from './pages/Checklist'

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/diagnosis" element={<Layout><Diagnosis /></Layout>} />
          <Route path="/matching" element={<Layout><Matching /></Layout>} />
          <Route path="/business-plan" element={<Layout><BusinessPlan /></Layout>} />
          <Route path="/checklist" element={<Layout><Checklist /></Layout>} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
