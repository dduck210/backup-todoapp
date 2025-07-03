import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import getUserByUsername from "../api/users";
import { toast } from "react-toastify";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!username || !password) {
      setError("Please enter complete information");
      toast.error("Login failed!");
      return;
    }
    const user = await getUserByUsername(username);
    if (!user) {
      setError("Username does not exist");
      toast.warning("Username does not exist");
      return;
    }
    if (user.password !== password) {
      setError("Wrong account or password");
      toast.warning("Wrong account or password");
      return;
    }
    localStorage.setItem("token", user.id);
    localStorage.setItem("user", JSON.stringify(user));
    toast.success("Login Successful!");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 px-2">
      <form
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl transition-all"
        onSubmit={handleLogin}
      >
        <h2 className="text-3xl text-center font-extrabold mb-8 text-blue-700 tracking-tight">
          Login
        </h2>
        {error && (
          <div className="mb-4 text-center text-red-500 font-medium">
            {error}
          </div>
        )}
        <input
          className="w-full mb-4 px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
        />
        <input
          className="w-full mb-6 px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
        />
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow transition-all text-lg"
          type="submit"
        >
          Login
        </button>
        <div className="mt-6 text-center text-sm text-gray-700 font-semibold">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 underline hover:text-blue-800 transition font-semibold"
          >
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
