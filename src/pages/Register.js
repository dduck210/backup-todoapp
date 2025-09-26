// src/pages/Register.js
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import getUserByUsername, { createUser } from "../api/users";
import { toast } from "react-toastify";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);

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
    if (!confirmPassword) errs.confirm = "비밀번호를 다시 입력해주세요.";
    else if (password && password !== confirmPassword)
      errs.confirm = "비밀번호가 일치하지 않습니다.";
    return errs;
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setErrors({});

    const errs = validate();
    setErrors(errs);

    if (errs.username) {
      usernameRef.current?.focus();
      return;
    }
    if (errs.password) {
      passwordRef.current?.focus();
      return;
    }
    if (errs.confirm) {
      confirmRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      const existedUser = await getUserByUsername(username.trim());
      if (existedUser) {
        setErrors({ username: "이미 존재하는 아이디입니다." });
        usernameRef.current?.focus();
        toast.warning("이미 존재하는 아이디입니다.");
        setIsSubmitting(false);
        return;
      }

      const user = await createUser({ username: username.trim(), password });

      // 🔑 chỉ lưu id + username
      const minimalUser = { id: user.id, username: user.username };
      localStorage.setItem("token", minimalUser.id);
      localStorage.setItem("user", JSON.stringify(minimalUser));

      toast.success("회원가입 성공!");
      setTimeout(() => {
        setIsSubmitting(false);
        navigate("/");
      }, 500);
    } catch (error) {
      setErrors({ other: "회원가입에 실패했습니다!" });
      toast.error("회원가입에 실패했습니다!");
      setIsSubmitting(false);
    }
  };

  const handleInput = (field, value) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
    if (field === "username") setUsername(value);
    if (field === "password") setPassword(value);
    if (field === "confirm") setConfirmPassword(value);
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
      <div className="absolute inset-0 z-0 bg-black/40" aria-hidden />
      <form
        onSubmit={handleRegister}
        autoComplete="on"
        className="relative z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700 transition-all hover:scale-[1.01]"
      >
        <h2 className="text-4xl text-center font-extrabold mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          회원가입
        </h2>

        {(errors.username ||
          errors.password ||
          errors.confirm ||
          errors.other) && (
          <div className="mb-4 text-center text-red-500 font-medium">
            {errors.username ||
              errors.password ||
              errors.confirm ||
              errors.other}
          </div>
        )}

        {/* Username */}
        <div className="relative mb-5">
          <span className="absolute left-3 top-3 text-gray-400">
            <i className="fas fa-user" />
          </span>
          <input
            className={`w-full pl-10 pr-4 py-3 border ${errors.username ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-gray-100`}
            placeholder="아이디"
            value={username}
            onChange={(e) => handleInput("username", e.target.value)}
            autoComplete="username"
            ref={usernameRef}
          />
        </div>

        {/* Password */}
        <div className="relative mb-5">
          <span className="absolute left-3 top-3 text-gray-400">
            <i className="fas fa-lock" />
          </span>
          <input
            type="password"
            className={`w-full pl-10 pr-4 py-3 border ${errors.password ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-gray-100`}
            placeholder="비밀번호"
            value={password}
            onChange={(e) => handleInput("password", e.target.value)}
            autoComplete="new-password"
            ref={passwordRef}
          />
        </div>

        {/* Confirm Password */}
        <div className="relative mb-8">
          <span className="absolute left-3 top-3 text-gray-400">
            <i className="fas fa-check" />
          </span>
          <input
            type="password"
            className={`w-full pl-10 pr-4 py-3 border ${errors.confirm ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-gray-100`}
            placeholder="비밀번호 재입력"
            value={confirmPassword}
            onChange={(e) => handleInput("confirm", e.target.value)}
            autoComplete="new-password"
            ref={confirmRef}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all text-lg flex items-center justify-center"
        >
          {isSubmitting ? (
            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
          ) : (
            "회원가입"
          )}
        </button>

        <div className="mt-6 text-center text-sm text-gray-700 dark:text-gray-200">
          이미 계정이 있으신가요?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-blue-600 dark:text-blue-300 hover:text-indigo-600 font-semibold underline"
          >
            로그인
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
