import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import {
  LayoutDashboard,
  Presentation,
  Users,
  MoreHorizontal,
  LogOut,
} from "lucide-react";

function Header() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);

  // =========================================================
  // OBTENER USUARIO
  // =========================================================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error leyendo usuario:", error);
      }
    }
  }, []);

  // =========================================================
  // CERRAR MENÚ AL HACER CLIC FUERA
  // =========================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // =========================================================
  // INICIALES DEL USUARIO
  // =========================================================

  const getInitials = (name = "") => {
    const words = name.trim().split(" ");

    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }

    return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
  };

  // =========================================================
  // NOMBRE DEL ROL
  // =========================================================

  const getRoleName = (role) => {
    if (role === "ADMIN") {
      return "Administrador";
    }

    return "Usuario";
  };

  // =========================================================
  // CERRAR SESIÓN
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setMenuOpen(false);

    navigate("/login");
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-[100] flex h-16 items-center border-b border-slate-200 bg-white px-8">

      {/* =====================================================
          LOGO
      ====================================================== */}

      <div className="shrink-0">
        <h1 className="flex items-center gap-2 text-lg font-bold text-slate-800">
          <img
            src={logo}
            alt="Logo"
            className="h-8 w-8 object-contain"
          />

          <span>
            <span className="text-[#297AFF]">Team</span>Board
          </span>
        </h1>
      </div>

      {/* =====================================================
          OPCIONES DE NAVEGACIÓN
      ====================================================== */}

      <nav className="ml-16 flex items-center gap-5">

        {/* Dashboard */}

        <Link
          to="/"
          className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:text-[#297AFF]"
        >
          <LayoutDashboard className="h-4 w-4 text-[#297AFF]" />
          Dashboard
        </Link>

        {/* Tablero */}

        <Link
          to="/tablero"
          className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:text-[#297AFF]"
        >
          <Presentation className="h-4 w-4 text-[#297AFF]" />
          Tablero
        </Link>

        {/* Usuarios - Solo ADMIN */}

        {user?.role === "ADMIN" && (
          <Link
            to="/usuarios"
            className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:text-[#297AFF]"
          >
            <Users className="h-4 w-4 text-[#297AFF]" />
            Usuarios
          </Link>
        )}

      </nav>

      {/* =====================================================
          USUARIO
      ====================================================== */}

      <div
        ref={menuRef}
        className="relative z-[110] ml-auto flex items-center gap-3"
      >

        {/* ===================================================
            AVATAR
        ==================================================== */}

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
          {user ? getInitials(user.name) : "??"}
        </div>

        {/* ===================================================
            INFORMACIÓN DEL USUARIO
        ==================================================== */}

        <div className="hidden sm:block">
          <p className="text-sm font-medium text-slate-700">
            {user?.name || "Usuario"}
          </p>

          <p className="text-xs text-slate-500">
            {user ? getRoleName(user.role) : "Usuario"}
          </p>
        </div>

        {/* ===================================================
            BOTÓN OPCIONES
        ==================================================== */}

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          title="Opciones"
        >
          <MoreHorizontal size={20} />
        </button>

        {/* ===================================================
            MENÚ DESPLEGABLE
        ==================================================== */}

        {menuOpen && (
          <div className="absolute right-0 top-12 z-[999] w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={17} />
              Cerrar sesión
            </button>

          </div>
        )}

      </div>

    </header>
  );
}

export default Header;