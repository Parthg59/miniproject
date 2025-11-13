import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1f35',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          },
          success: {
            style: {
              background: '#1a1f35',
              color: '#10b981',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }
          },
          error: {
            style: {
              background: '#1a1f35',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }
          }
        }}
      />
    </div>
  );
}

export default App;
