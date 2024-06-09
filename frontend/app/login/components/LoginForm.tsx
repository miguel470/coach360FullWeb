"use client";
import { FC } from "react";
import Link from "next/link";
import useLoginForm from "@/lib/useLoginForm";

const LoginForm: FC = () => {
  const { formData, errorMessage, loading, handleInputChange, handleLogin } =
    useLoginForm();

  return (
    <div className="flex flex-col items-center justify-center flex-grow">
      <form
        className="bg-login-register p-8 rounded shadow-md sm:w-96 w-full"
        onSubmit={handleLogin}
      >
        <h2 className="text-2xl font-bold mb-6 text-black">Inicio de sesión</h2>
        {errorMessage && (
          <div className="mb-4 text-red-500">
            <p>Error: {errorMessage}</p>
          </div>
        )}
        <div className="mb-4">
          <label
            className="block text-black text-sm font-semibold mb-2"
            htmlFor="identifier"
          >
            Nombre de usuario o correo electrónico
          </label>
          <input
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-300"
            type="text"
            id="identifier"
            name="identifier"
            required
            value={formData.identifier}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-black text-sm font-semibold mb-2"
            htmlFor="password"
          >
            Contraseña
          </label>
          <input
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-300"
            type="password"
            id="password"
            name="password"
            required
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        <button
          className="w-full custom-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>
        <div className="mt-4 hover:text-blue-500">
          <Link href={"/registro"}>Pincha y crea tu cuenta.</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
