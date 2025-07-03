import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/hooks/ProtectedRoute";
import UnauthRoute from "./components/hooks/UnauthRoute";
import TestToast from "./components/TestToast";
import Loading from "./components/Loading/Loading";

function App() {
  return (
    <Loading>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-4 mt-0 bg-gray-500">
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
            <Route path="/test-toast" element={<TestToast />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <ToastContainer />
    </Loading>
  );
}
export default App;
