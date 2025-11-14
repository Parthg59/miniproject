import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <ThemeProvider>
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
              background: 'var(--toast-bg)',
              color: 'var(--toast-text)',
              border: 'var(--toast-border)'
            },
            success: {
              style: {
                background: 'var(--toast-success-bg)',
                color: 'var(--toast-success-text)',
                border: 'var(--toast-success-border)'
              }
            },
            error: {
              style: {
                background: 'var(--toast-error-bg)',
                color: 'var(--toast-error-text)',
                border: 'var(--toast-error-border)'
              }
            }
          }}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
