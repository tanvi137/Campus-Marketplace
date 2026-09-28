import { Link, useLocation } from "react-router-dom";
import {
  Heart,
  Menu,
  Moon,
  Plus,
  ShoppingBag,
  Sun,
  X,
} from "lucide-react";
import { useState } from "react";

function Navbar({
  favorites = [],
  theme = "light",
  onToggleTheme,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const location = useLocation();

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isDark = theme === "dark";

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  const navLinkClass = (active) =>
    `relative text-sm font-semibold transition-colors ${
      active
        ? "text-indigo-600 dark:text-indigo-400"
        : isDark
        ? "text-slate-300 hover:text-white"
        : "text-slate-500 hover:text-slate-950"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-all duration-300 ${
        isDark
          ? "border-slate-800 bg-[#020617]/90 shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
          : "border-slate-200/80 bg-white/90"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        {/* BRAND */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="group flex items-center gap-3"
        >
          <div
            className={`relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl text-white shadow-[0_8px_25px_rgba(15,23,42,0.18)] transition-all duration-300 group-hover:-translate-y-0.5 ${
              isDark
                ? "bg-indigo-600 shadow-indigo-950/40"
                : "bg-slate-950"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <ShoppingBag
              size={20}
              strokeWidth={2.2}
              className="relative z-10"
            />
          </div>

          <div className="leading-none">
            <span
              className={`block text-[17px] font-bold tracking-[-0.02em] ${
                isDark
                  ? "text-white"
                  : "text-slate-950"
              }`}
            >
              CampusMart
            </span>

            <span
              className={`mt-1 block text-[9px] font-semibold uppercase tracking-[0.2em] ${
                isDark
                  ? "text-slate-500"
                  : "text-slate-400"
              }`}
            >
              Student marketplace
            </span>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className={navLinkClass(isActive("/"))}
          >
            Browse

            {isActive("/") && (
              <span className="absolute -bottom-[25px] left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-indigo-600" />
            )}
          </Link>

          <a
            href="/#categories"
            className={`text-sm font-semibold transition-colors ${
              isDark
                ? "text-slate-300 hover:text-white"
                : "text-slate-500 hover:text-slate-950"
            }`}
          >
            Categories
          </a>

          <Link
            to="/my-listings"
            className={navLinkClass(
              isActive("/my-listings")
            )}
          >
            My Listings

            {isActive("/my-listings") && (
              <span className="absolute -bottom-[25px] left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-indigo-600" />
            )}
          </Link>

          {/* FAVORITES */}
          <Link
            to="/favorites"
            className={`relative flex items-center gap-2 text-sm font-semibold transition-colors ${
              isActive("/favorites")
                ? "text-red-500"
                : isDark
                ? "text-slate-300 hover:text-red-400"
                : "text-slate-500 hover:text-red-500"
            }`}
          >
            <Heart
              size={16}
              strokeWidth={2}
              fill={
                favorites.length > 0
                  ? "currentColor"
                  : "none"
              }
            />

            Favorites

            {favorites.length > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white shadow-sm">
                {favorites.length}
              </span>
            )}

            {isActive("/favorites") && (
              <span className="absolute -bottom-[25px] left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-red-500" />
            )}
          </Link>
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="hidden items-center gap-3 md:flex">
          {/* THEME TOGGLE */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={
              isDark
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            title={
              isDark
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200 ${
              isDark
                ? "border-slate-700 bg-slate-900 text-amber-300 hover:border-indigo-500/40 hover:bg-slate-800"
                : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
            }`}
          >
            {isDark ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>

          {/* SELL */}
          <Link
            to="/sell"
            className="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(15,23,42,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-[0_12px_25px_rgba(79,70,229,0.22)] dark:bg-indigo-600 dark:hover:bg-indigo-500"
          >
            <Plus
              size={17}
              strokeWidth={2.5}
            />
            Sell an item
          </Link>
        </div>

        {/* MOBILE ACTIONS */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={
              isDark
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            title={
              isDark
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
              isDark
                ? "border-slate-700 bg-slate-900 text-amber-300 hover:bg-slate-800"
                : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
            }`}
          >
            {isDark ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                (open) => !open
              )
            }
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
              isDark
                ? "border-slate-700 bg-slate-900 text-slate-200 hover:border-indigo-500 hover:bg-slate-800 hover:text-indigo-400"
                : "border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
            }`}
            aria-label={
              mobileMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGATION */}
      {mobileMenuOpen && (
        <div
          className={`border-t px-5 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl md:hidden ${
            isDark
              ? "border-slate-800 bg-[#020617]"
              : "border-slate-100 bg-white"
          }`}
        >
          <nav className="flex flex-col gap-1">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className={`rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${
                isActive("/")
                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                  : isDark
                  ? "text-slate-300 hover:bg-slate-900 hover:text-white"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              Browse
            </Link>

            <a
              href="/#categories"
              onClick={closeMobileMenu}
              className={`rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${
                isDark
                  ? "text-slate-300 hover:bg-slate-900 hover:text-white"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              Categories
            </a>

            <Link
              to="/my-listings"
              onClick={closeMobileMenu}
              className={`rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${
                isActive("/my-listings")
                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                  : isDark
                  ? "text-slate-300 hover:bg-slate-900 hover:text-white"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              My Listings
            </Link>

            <Link
              to="/favorites"
              onClick={closeMobileMenu}
              className={`flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${
                isActive("/favorites")
                  ? "bg-red-50 text-red-500 dark:bg-red-500/10"
                  : isDark
                  ? "text-slate-300 hover:bg-red-500/10 hover:text-red-400"
                  : "text-slate-700 hover:bg-red-50 hover:text-red-500"
              }`}
            >
              <span className="flex items-center gap-2">
                <Heart
                  size={17}
                  fill={
                    favorites.length > 0
                      ? "currentColor"
                      : "none"
                  }
                />
                Favorites
              </span>

              {favorites.length > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                  {favorites.length}
                </span>
              )}
            </Link>

            <Link
              to="/sell"
              onClick={closeMobileMenu}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500"
            >
              <Plus
                size={17}
                strokeWidth={2.5}
              />
              Sell an item
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;