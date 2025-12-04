import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastProvider } from './components/ui/Toast'
import Dashboard from './pages/Dashboard'
import Editor from './pages/Editor'
import PublicSite from './pages/PublicSite'

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Dashboard - Liste des sites */}
          <Route path="/" element={<Dashboard />} />
          
          {/* Éditeur de site */}
          <Route path="/editor/:slug" element={<Editor />} />
          
          {/* Site public */}
          <Route path="/site/:slug" element={<PublicSite />} />
          
          {/* Fallback - redirige vers Dashboard */}
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
