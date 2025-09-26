import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/hooks/ProtectedRoute";
import UnauthRoute from "./components/hooks/UnauthRoute";
import AdminRoute from "./components/hooks/AdminRoute";
import Loading from "./components/Loading/Loading";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <Loading>
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Header />
        <main className="flex-1 pt-16 pb-14">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <UnauthRoute>
                  <Login />
                </UnauthRoute>
              }
            />
            <Route
              path="/register"
              element={
                <UnauthRoute>
                  <Register />
                </UnauthRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
      <ToastContainer />
    </Loading>
  );
}

export default App;
