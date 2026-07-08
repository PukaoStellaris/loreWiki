import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import OsuRenderPage from './pages/OsuRenderPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <OsuRenderPage />
  </StrictMode>,
)
