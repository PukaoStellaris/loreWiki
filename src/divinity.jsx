import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LoreWiki from './pages/wikiPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoreWiki />
  </StrictMode>,
)
