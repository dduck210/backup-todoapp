import { useState } from "react";
import getUserByUsername, { createUser } from "../api/users";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");
    if (!username || !password || !confirmPassword) {
      setError("Please enter complete information");
      toast.error("Registration failed!");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const existedUser = await getUserByUsername(username);
      if (existedUser) {
        setError("Username already exists");
        toast.warning("Username already exists");
        return;
      }
      const user = await createUser({ username, password });
      localStorage.setItem("token", user.id);
      localStorage.setItem("username", user.username);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Registration Successful!");
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      setError("Registration failed!");
    }
  };

  if (localStorage.getItem("token")) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 px-2">
      <form
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl transition-all"
        onSubmit={handleRegister}
      >
        <h2 className="text-3xl text-center font-extrabold mb-8 text-blue-700 tracking-tight">
          Register
        </h2>
        {error && (
          <div className="text-center mb-4 text-red-500 font-medium">
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
          className="w-full mb-4 px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
        />
        <input
          className="w-full mb-6 px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          type="password"
          placeholder="Re-enter password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          autoComplete="new-password"
        />
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow transition-all text-lg"
          type="submit"
        >
          Register
        </button>
        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            className="text-blue-600 hover:underline font-semibold"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
