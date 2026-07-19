import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ChatStudio from './pages/chatPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChatStudio />
  </StrictMode>,
)
