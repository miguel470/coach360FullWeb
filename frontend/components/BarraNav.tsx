"use client";
import { FC, useState } from "react";
import Link from "next/link";
import useNavBar from "@/lib/useNavBar";

const BarraNav: FC = () => {
  const { isLoggedIn, handleLogout } = useNavBar();
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <nav className="bg-gradient-to-r from-azure-radiance-900 to-azure-radiance-500 fixed top-0 w-full z-10">
      <div className="container mx-auto ml-4 flex items-center justify-between">
        <Link href={"/"}>
          <img className="h-24 w-auto" src="coach360.png" alt="Logo" />
        </Link>
        <div className="hidden lg:flex items-center space-x-4 mr-6">
          <NavLink href="/Plantilla" text="Plantilla" />
          <NavLink href="/Entreno" text="Ejercicios" />
          <NavLink href="/Calendario" text="Calendario" />
          {isLoggedIn ? (
            <button
              className="text-white text-xl rounded-lg p-4 transition duration-300 ease-in-out hover:text-red-400"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </button>
          ) : (
            <Link href="/login">
              <span className="text-white text-xl rounded-lg p-4 transition duration-300 ease-in-out hover:text-blue-200">
                Iniciar Sesión
              </span>
            </Link>
          )}
        </div>
        <div className="lg:hidden mr-8">
          <button
            className="text-white focus:outline-none text-2xl"
            onClick={toggleMenu}
          >
            {menuVisible ? "✕" : "☰"}
          </button>
        </div>
        <ul
          className={`lg:hidden fixed right-0 top-16 bg-gradient-to-r from-azure-radiance-900 to-azure-radiance-500 rounded-md overflow-hidden transition-opacity duration-300 ${
            menuVisible ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <NavLinkMobile href="/Plantilla" text="Plantilla" />
          <NavLinkMobile href="/Entreno" text="Ejercicios" />
          <NavLinkMobile href="/Calendario" text="Calendario" />
          <li className="py-2 px-4">
            {isLoggedIn ? (
              <button
                className="text-white text-xl nav-link rounded-lg p-2 transition duration-300 ease-in-out hover:text-red-400"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </button>
            ) : (
              <Link href="/login">
                <span className="text-white text-xl nav-link rounded-lg p-2 transition duration-300 ease-in-out hover:text-blue-200">
                  Iniciar Sesión
                </span>
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

const NavLink: FC<{ href: string; text: string }> = ({ href, text }) => (
  <Link href={href}>
    <span className="text-white text-xl rounded-lg p-4 transition duration-300 ease-in-out hover:text-blue-200">
      {text}
    </span>
  </Link>
);

const NavLinkMobile: FC<{ href: string; text: string }> = ({ href, text }) => (
  <li className="py-2 px-4">
    <Link href={href}>
      <span className="text-white text-xl rounded-lg p-2 transition duration-300 ease-in-out hover:text-blue-200">
        {text}
      </span>
    </Link>
  </li>
);

export default BarraNav;
