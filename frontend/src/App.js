import './App.css';
import React from 'react'
import { Routes, Route, Navigate } from "react-router-dom"
import AdministrationPage from "./pages/administration/administration.page"
import LoginPage from "./pages/login/login.page"
import GoToPage from "./pages/goto/goto.page"
import ErrorBoundary from "./components/error_boundary.component"
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './hooks/use-auth.hook'
import ProtectedRoute from './components/protected-route.component';
import { dark } from './constants/theme'

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={dark}>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={ <LoginPage /> } />
            <Route path="login" element={ <LoginPage /> } />
            <Route path="goto" element={ 
              <ProtectedRoute> 
                <GoToPage /> 
              </ProtectedRoute> 
            } />
            <Route path="administration" element={ 
              <ProtectedRoute> 
                <AdministrationPage /> 
              </ProtectedRoute> 
            } />
            {/* Redirect to login if it is an unknwon route */}
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
        </ErrorBoundary>
        <CssBaseline />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
