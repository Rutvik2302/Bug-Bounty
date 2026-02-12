import React from "react";
import { useNavigate } from "react-router-dom";

const Heder = () => {
  const navigate = useNavigate();

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    navigate("/");
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      {/* Logo Section */}
      <div
        className="flex items-center gap-2 text-xl font-bold text-gray-800 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => navigate("/dashboard")}
      >
        <span role="img" aria-label="bug">
          🐞
        </span>
        <span>Bug Bounty</span>
      </div>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center gap-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
        >
          Dashboard
        </button>
        <button className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
          My Bugs
        </button>
        <button className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
          Create Bug
        </button>
        <button className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
          Profile
        </button>
      </nav>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        {user && (
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-gray-900 leading-tight">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 uppercase tracking-tighter">
              Hunter
            </p>
          </div>
        )}

        <button
          className="px-4 py-2 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200 active:scale-95"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Heder;
