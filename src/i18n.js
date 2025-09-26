import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      header: {
        logo: "Todo App",
        menu_label: "Open menu",
        toggle_dark: "Toggle dark mode",
        home: "Home",
        hello_user: "Hello, {{username}}!",
        logout: "Logout",
        login: "Login",
        register: "Register",
      },
      toast: {
        logout_success: "Logged out successfully!",
      },
    },
  },
  vi: {
    translation: {
      header: {
        logo: "Ứng dụng Todo",
        menu_label: "Mở menu",
        toggle_dark: "Chuyển chế độ tối/sáng",
        home: "Trang chủ",
        hello_user: "Xin chào, {{username}}!",
        logout: "Đăng xuất",
        login: "Đăng nhập",
        register: "Đăng ký",
      },
      toast: {
        logout_success: "Đăng xuất thành công!",
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // ngôn ngữ mặc định
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
