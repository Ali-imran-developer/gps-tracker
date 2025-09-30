import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import WebSocket from "./pages/Websocket";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AuthController from "./controllers/authController";
import { MapProvider } from "./config/mapProvider";

const ProtectedRoute = ({ children }) => {
  const session = AuthController.getSession();
  if (!session || !session.user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const session = AuthController.getSession();
  if (session && session.user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {

  return (
    <MapProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/websocket" element={<ProtectedRoute><WebSocket /></ProtectedRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </MapProvider>
  );
};

export default App;