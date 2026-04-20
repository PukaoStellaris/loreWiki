import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import JennyPage from './pages/JennyPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <JennyPage />
  </StrictMode>,
)
