import './App.css';
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import AdministrationPage from "./pages/administration/administration.page"
import LoginPage from "./pages/login/login.page"
import GoToPage from "./pages/goto/goto.page"
import ErrorBoundary from "./components/error_boundary.component"

function App() {

  const navigate = useNavigate()

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={ <LoginPage /> } />
        <Route path="login" element={ <LoginPage /> } />
        <Route path="goto" element={ <GoToPage /> } />
        <Route path="administration" element={ <AdministrationPage navigate={ navigate }/> } />
        {/* Redirect to login if route is unknwon */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </ErrorBoundary>
    
  );
}

export default App;
