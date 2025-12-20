import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { App } from './App';
import AdminUploadHelper from './AdminUploadHelper';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/helper" element={<AdminUploadHelper />} />
      </Routes>
    </Router>
  </StrictMode>,
)