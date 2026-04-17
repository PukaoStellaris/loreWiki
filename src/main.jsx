import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import PhantasmaPage from './pages/PhantasmaPage.jsx'
import LoreWiki from './pages/wikiPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/phantasma" element={<PhantasmaPage />} />
        <Route path="/divinity" element={<LoreWiki />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
