import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import WhitePage from './pages/WhitePage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WhitePage />
  </StrictMode>,
)
