import { useState, useRef } from "react";
import getUserByUsername, { createUser } from "../api/users";
import { useNavigate } from "react-router-dom";
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

    // focus vào trường đầu tiên bị lỗi:
    if (errs.username) {
      usernameRef.current && usernameRef.current.focus();
      return;
    }
    if (errs.password) {
      passwordRef.current && passwordRef.current.focus();
      return;
    }
    if (errs.confirm) {
      confirmRef.current && confirmRef.current.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      const existedUser = await getUserByUsername(username.trim());
      if (existedUser) {
        setErrors({ username: "이미 존재하는 아이디입니다." });
        usernameRef.current && usernameRef.current.focus();
        toast.warning("이미 존재하는 아이디입니다.");
        setIsSubmitting(false);
        return;
      }
      const user = await createUser({ username: username.trim(), password });
      localStorage.setItem("token", user.id);
      localStorage.setItem("username", user.username);
      localStorage.setItem("user", JSON.stringify(user));
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

  // Reset lỗi khi nhập lại
  const handleInput = (field, value) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
    if (field === "username") setUsername(value);
    if (field === "password") setPassword(value);
    if (field === "confirm") setConfirmPassword(value);
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
        autoComplete="on"
      >
        <h2 className="text-3xl text-center font-extrabold mb-8 text-blue-700 dark:text-gray-100 tracking-tight">
          회원가입
        </h2>
        {(errors.username ||
          errors.password ||
          errors.confirm ||
          errors.other) && (
          <div className="text-center mb-4 text-red-500 font-medium">
            {errors.username ||
              errors.password ||
              errors.confirm ||
              errors.other}
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
          className={`w-full mb-4 px-4 py-3 border ${
            errors.password
              ? "border-red-500"
              : "border-blue-300 dark:border-gray-600"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-gray-500 transition bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(event) => handleInput("password", event.target.value)}
          autoComplete="new-password"
          ref={passwordRef}
        />
        <input
          className={`w-full mb-6 px-4 py-3 border ${
            errors.confirm
              ? "border-red-500"
              : "border-blue-300 dark:border-gray-600"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-gray-500 transition bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
          type="password"
          placeholder="비밀번호 재입력"
          value={confirmPassword}
          onChange={(event) => handleInput("confirm", event.target.value)}
          autoComplete="new-password"
          ref={confirmRef}
        />
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow transition-all text-lg"
          type="submit"
          disabled={isSubmitting}
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
