import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Diagnosis from './pages/Diagnosis'
import Matching from './pages/Matching'
import BusinessPlan from './pages/BusinessPlan'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/diagnosis" element={<Diagnosis />} />
        <Route path="/matching" element={<Matching />} />
        <Route path="/business-plan" element={<BusinessPlan />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
