import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import getUserByUsername from "../api/users";
import { toast } from "react-toastify";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  // Validate rules
  const validate = () => {
    const errs = {};
    const uname = username.trim();
    if (!uname) errs.username = "아이디를 입력해주세요.";
    else if (!/^[a-zA-Z0-9_]{3,20}$/.test(uname))
      errs.username =
        "아이디는 3~20자 영문, 숫자, 밑줄(_)만 입력할 수 있습니다.";

    if (!password) errs.password = "비밀번호를 입력해주세요.";
    else if (password.length < 4)
      errs.password = "비밀번호는 4자 이상이어야 합니다.";

    return errs;
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setErrors({});
    setUsername(username.trim());
    setPassword(password);

    const errs = validate();
    setErrors(errs);
    // Autofocus lỗi
    if (errs.username) {
      usernameRef.current && usernameRef.current.focus();
      setIsSubmitting(false);
      return;
    }
    if (errs.password) {
      passwordRef.current && passwordRef.current.focus();
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await getUserByUsername(username.trim());
      if (!user) {
        setErrors({ username: "존재하지 않는 아이디입니다." });
        usernameRef.current && usernameRef.current.focus();
        setIsSubmitting(false);
        return;
      }
      if (user.password !== password) {
        setErrors({ password: "아이디 또는 비밀번호가 잘못되었습니다." });
        passwordRef.current && passwordRef.current.focus();
        setIsSubmitting(false);
        return;
      }
      localStorage.setItem("token", user.id);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("로그인 성공!");
      setIsSubmitting(false);
      navigate("/");
    } catch (err) {
      toast.error("알 수 없는 오류가 발생했습니다. 다시 시도해주세요!");
      setIsSubmitting(false);
    }
  };

  // Xóa lỗi field khi nhập lại
  const handleInput = (field, value) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
    if (field === "username") setUsername(value);
    if (field === "password") setPassword(value);
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
        autoComplete="on"
      >
        <h2 className="text-3xl text-center font-extrabold mb-8 text-blue-700 dark:text-gray-100 tracking-tight">
          로그인
        </h2>
        {(errors.username || errors.password) && (
          <div className="mb-4 text-center text-red-500 font-medium">
            {errors.username || errors.password}
          </div>
        )}
        <input
          className={`w-full mb-4 px-4 py-3 border ${
            errors.username
              ? "border-red-500"
              : "border-blue-300 dark:border-gray-600"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-gray-500 transition bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
          placeholder="아이디"
          value={username}
          onChange={(event) => handleInput("username", event.target.value)}
          autoComplete="username"
          ref={usernameRef}
        />
        <input
          className={`w-full mb-6 px-4 py-3 border ${
            errors.password
              ? "border-red-500"
              : "border-blue-300 dark:border-gray-600"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-gray-500 transition bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(event) => handleInput("password", event.target.value)}
          autoComplete="current-password"
          ref={passwordRef}
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
