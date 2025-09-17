import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AuthController from "./controllers/authController";

const ProtectedRoute = ({ children }) => {
  const session = AuthController.getSession();
  if (!session || !session.user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;