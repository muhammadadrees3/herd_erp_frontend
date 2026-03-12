"use client";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Login from "../../../components/Login";
import { useTheme } from "../../../context/ThemeContext";

export default function Home() {
  const { isDark } = useTheme(); // no more local state

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDark
          ? "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-50"
      }`}
    >
      <Header />
      <Login />
      <Footer />
    </div>
  );
}
