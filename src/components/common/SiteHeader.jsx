import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Bell,
  User,
  LogOut,
  CheckCircle2,
  ShieldCheck,
  PhoneCall,
} from "lucide-react";
import bisLogo from "../../assets/bis-smart-assist-logo.png";
import { useAuthStore } from "../../store/authStore";
import LanguageSwitcher from "./LanguageSwitcher";

const NAV_KEYS = [
  { to: "/", key: "nav.home" },
  { to: "/#about", key: "nav.about" },
  { to: "/#services", key: "nav.services" },
  { to: "/#contact", key: "nav.contact" },
];

const NAVBAR_COLOR = "rgb(6,76,76)";

export default function SiteHeader() {
  const { t } = useTranslation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 shadow-md">
      {/* Official Government Top Bar */}
      <div className="border-b border-white/10 bg-slate-900/60 backdrop-blur-sm text-[11px] font-medium tracking-wide text-white/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1 md:px-6">
          <div className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-sans">
              GOVERNMENT OF INDIA • MINISTRY OF CONSUMER AFFAIRS
            </span>
          </div>
          <div className="hidden items-center gap-4 sm:flex text-white/80">
            <a
              href="tel:1800113011"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <PhoneCall size={11} className="text-emerald-400" />
              <span>
                Toll Free:{" "}
                <strong className="text-white font-semibold">
                  1800-11-3011
                </strong>
              </span>
            </a>
            <span className="text-white/30">|</span>
            <span className="flex items-center gap-1">
              <ShieldCheck size={12} className="text-amber-400" />
              <span>SIH 2026 AI Agent</span>
            </span>
            <span className="text-white/30">|</span>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div
        style={{ backgroundColor: NAVBAR_COLOR }}
        className="border-b border-black/10"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 md:px-6">
          <Link to="/" className="flex shrink-0 items-center gap-3 group">
            <div className="flex items-center justify-center rounded-lg bg-white px-2.5 py-1.5 shadow-sm transition-transform duration-200 group-hover:scale-105">
              <img
                src={bisLogo}
                alt="Bureau of Indian Standards logo"
                className="h-8 w-auto object-contain"
              />
            </div>
            <div className="hidden flex-col sm:flex text-white leading-tight">
              <span className="font-poppins text-sm font-bold tracking-tight text-white">
                BIS Smart Assist
              </span>
              <span className="text-[10px] font-medium text-white/80 tracking-wider uppercase">
                Bureau of Indian Standards
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_KEYS.map(({ to, key }) => {
              const isActive =
                to === "/"
                  ? location.pathname === "/" && !location.hash
                  : location.pathname === to ||
                    (to.startsWith("/#") &&
                      location.hash === to.replace("/", ""));
              return (
                <Link
                  key={to}
                  to={to}
                  className={`font-poppins px-3.5 py-1.5 text-sm font-medium rounded-control transition-all duration-150 ${
                    isActive
                      ? "bg-white/15 text-white shadow-inner"
                      : "text-white/90 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {t(key)}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                aria-label="Notifications"
                onClick={() => {
                  setNotifOpen((v) => !v);
                  setProfileOpen(false);
                }}
                className={`relative flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors ${
                  notifOpen ? "bg-white/20" : "hover:bg-white/10"
                }`}
              >
                <Bell size={18} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber-400 ring-2 ring-emerald-950" />
              </button>

              {notifOpen && (
                <div className="absolute right-0 z-50 mt-2 w-72 rounded-card border border-slate-200 bg-white p-4 text-sm shadow-xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                    <p className="font-semibold text-slate-800 text-xs uppercase tracking-wider">
                      Notifications
                    </p>
                    <span className="text-[11px] text-primary font-medium">
                      Clear all
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 py-2 text-slate-600">
                    <CheckCircle2
                      size={16}
                      className="text-emerald-600 shrink-0"
                    />
                    <div>
                      <p className="text-xs font-medium text-slate-700">
                        All systems operational
                      </p>
                      <p className="text-[11px] text-slate-400">
                        BIS e-standards directory is up to date.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <button
                type="button"
                aria-label="User Account"
                onClick={() => {
                  setProfileOpen((v) => !v);
                  setNotifOpen(false);
                }}
                className={`flex h-9 items-center gap-2 rounded-full px-2 text-white transition-colors ${
                  profileOpen ? "bg-white/20" : "hover:bg-white/10"
                }`}
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-xs font-semibold">
                  {isLoggedIn ? (
                    user?.name ? (
                      user.name.charAt(0).toUpperCase()
                    ) : (
                      "U"
                    )
                  ) : (
                    <User size={15} />
                  )}
                </div>
                {isLoggedIn && (
                  <span className="hidden text-xs font-medium text-white/90 lg:inline-block max-w-[90px] truncate">
                    {user?.name || user?.userType}
                  </span>
                )}
              </button>

              {profileOpen && (
                <div className="absolute right-0 z-50 mt-2 w-52 rounded-card border border-slate-200 bg-white p-2 text-slate-700 shadow-xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="border-b border-slate-100 px-3 py-2">
                    <p className="text-xs font-semibold text-slate-800 truncate">
                      {isLoggedIn
                        ? user?.name || "Authorized User"
                        : "Guest Session"}
                    </p>
                    <span className="mt-0.5 inline-block rounded bg-primary-50 px-1.5 py-0.5 text-[10px] font-medium text-primary-700">
                      {isLoggedIn
                        ? user?.userType || "Signed In"
                        : "Public Access"}
                    </span>
                  </div>

                  <div className="pt-1.5">
                    {isLoggedIn &&
                      (user?.role === "ADMIN" ||
                        user?.userType === "ADMIN") && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileOpen(false)}
                          className="flex w-full items-center gap-2 rounded-control px-3 py-2 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
                        >
                          <ShieldCheck size={14} /> Admin panel
                        </Link>
                      )}
                    {isLoggedIn ? (
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setProfileOpen(false);
                          navigate("/login");
                        }}
                        className="flex w-full items-center gap-2 rounded-control px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                      >
                        <LogOut size={14} /> Log out
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setProfileOpen(false);
                          navigate("/login");
                        }}
                        className="flex w-full items-center gap-2 rounded-control px-3 py-2 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-50"
                      >
                        <User size={14} /> Sign in / Register
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              type="button"
              aria-label="Toggle navigation menu"
              onClick={() => setMobileNavOpen((v) => !v)}
              className="ml-1 flex h-9 w-9 items-center justify-center rounded-control text-white hover:bg-white/10 md:hidden"
            >
              {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <nav
          style={{ backgroundColor: NAVBAR_COLOR }}
          className="flex flex-col gap-1 border-t border-white/10 px-4 py-3 md:hidden"
        >
          <div className="pb-2 mb-1 border-b border-white/10">
            <LanguageSwitcher />
          </div>
          {NAV_KEYS.map(({ to, key }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileNavOpen(false)}
              className="font-poppins rounded-control px-3 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              {t(key)}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
