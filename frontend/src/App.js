import './App.css';
import React from 'react'
import { Routes, Route, Navigate } from "react-router-dom"
import AdministrationPage from "./pages/administration/administration.page"
import LoginPage from "./pages/login/login.page"
import GoToPage from "./pages/goto/goto.page"
import ErrorBoundary from "./components/error_boundary.component"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './hooks/use-auth.hook'
import ProtectedRoute from './components/protected-route.component';

function App() {

  // initialize theme 
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
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
        <CssBaseline />
      </ErrorBoundary>
    </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
