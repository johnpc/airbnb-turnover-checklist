import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import outputs from '../amplify_outputs.json'
import './index.css'
import App from './App.tsx'

// Configure Amplify before rendering
Amplify.configure(outputs)

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Silently fail if service worker registration fails
    })
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
