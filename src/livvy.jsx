import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LivvyPage from './pages/LivvyPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LivvyPage />
  </StrictMode>,
)
