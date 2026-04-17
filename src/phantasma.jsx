import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import PhantasmaPage from './pages/PhantasmaPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PhantasmaPage />
  </StrictMode>,
)
