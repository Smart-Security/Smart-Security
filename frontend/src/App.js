import './App.css';
import { Routes, Route, Navigate } from "react-router-dom"
import AdministrationPage from "./pages/administration/administration.page"
import LoginPage from "./pages/login/login.page"
import GoToPage from "./pages/goto/goto.page"
import ErrorBoundary from "./components/error_boundary.component"

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={ <LoginPage /> } />
        <Route path="login" element={ <LoginPage /> } />
        <Route path="goto" element={ <GoToPage /> } />
        <Route path="administration" element={ <AdministrationPage /> } />
        {/* Redirect to login if it is an unknwon route */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </ErrorBoundary>
    
  );
}

export default App;
