import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { applyBrandColor } from './utils/brandColor.js'

// Derive brand color from logo before initial paint (non-blocking)
applyBrandColor();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
