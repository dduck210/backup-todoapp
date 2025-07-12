import { useState } from "react";
import getUserByUsername, { createUser } from "../api/users";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
      setError("모든 정보를 입력하세요");
      toast.error("회원가입에 실패했습니다!");
      return;
    }
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다");
      return;
    }
    try {
      const existedUser = await getUserByUsername(username);
      if (existedUser) {
        setError("이미 존재하는 아이디입니다");
        toast.warning("이미 존재하는 아이디입니다");
        return;
      }
      const user = await createUser({ username, password });
      localStorage.setItem("token", user.id);
      localStorage.setItem("username", user.username);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("회원가입 성공!");
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      setError("회원가입에 실패했습니다!");
    }
  };

  if (localStorage.getItem("token")) {
    navigate("/");
    return null;
  }

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
      <div className="absolute inset-0 z-0 bg-black/40" aria-hidden />
      <form
        className="relative z-10 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl transition-all"
        onSubmit={handleRegister}
      >
        <h2 className="text-3xl text-center font-extrabold mb-8 text-blue-700 dark:text-gray-100 tracking-tight">
          회원가입
        </h2>
        {error && (
          <div className="text-center mb-4 text-red-500 font-medium">
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
          className="w-full mb-4 px-4 py-3 border border-blue-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-gray-500 transition bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
        />
        <input
          className="w-full mb-6 px-4 py-3 border border-blue-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-gray-500 transition bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          type="password"
          placeholder="비밀번호 재입력"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          autoComplete="new-password"
        />
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow transition-all text-lg"
          type="submit"
        >
          회원가입
        </button>
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-100">
          이미 계정이 있으신가요?{" "}
          <button
            type="button"
            className="text-blue-600 dark:text-blue-300 hover:underline font-semibold"
            onClick={() => navigate("/login")}
          >
            로그인
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
