import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import getUserByUsername from "../api/users";
import { toast } from "react-toastify";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    if (!username || !password) {
      setError("모든 정보를 입력하세요");
      setIsSubmitting(false);
      return;
    }
    const user = await getUserByUsername(username);
    if (!user) {
      setError("존재하지 않는 아이디입니다");
      setIsSubmitting(false);
      return;
    }
    if (user.password !== password) {
      setError("아이디 또는 비밀번호가 잘못되었습니다");
      setIsSubmitting(false);
      return;
    }
    localStorage.setItem("token", user.id);
    localStorage.setItem("user", JSON.stringify(user));
    toast.success("로그인 성공!");
    setIsSubmitting(false);
    navigate("/");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-2"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-vector/geometric-gradient-futuristic-background_23-2149116406.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      <div className="absolute inset-0 bg-black/40 z-0" aria-hidden />
      <form
        className="relative z-10 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl transition-all"
        onSubmit={handleLogin}
      >
        <h2 className="text-3xl text-center font-extrabold mb-8 text-blue-700 dark:text-gray-100 tracking-tight">
          로그인
        </h2>
        {error && (
          <div className="mb-4 text-center text-red-500 font-medium">
            {error}
          </div>
        )}
        <input
          className="w-full mb-4 px-4 py-3 border border-blue-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-gray-500 transition bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          placeholder="아이디"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
        />
        <input
          className="w-full mb-6 px-4 py-3 border border-blue-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-gray-500 transition bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
        />
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow transition-all text-lg"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "로그인 중..." : "로그인"}
        </button>
        <div className="mt-6 text-center text-sm text-gray-700 dark:text-gray-100 font-semibold">
          계정이 없으신가요?{" "}
          <Link
            to="/register"
            className="text-blue-600 dark:text-blue-300 underline hover:text-blue-800 dark:hover:text-blue-400 transition font-semibold"
          >
            회원가입
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
