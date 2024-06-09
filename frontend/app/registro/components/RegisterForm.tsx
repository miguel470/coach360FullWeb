"use client";
import React, { useState } from "react";

interface RegisterFormProps {}

const RegisterForm: React.FC<RegisterFormProps> = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      setErrorMessage("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/auth/local/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      );

      if (response.ok) {
        setSuccessMessage("¡Registro exitoso!");
        setUsername("");
        setEmail("");
        setPassword("");
        setPasswordConfirm("");
      } else {
        const data = await response.json();
        setErrorMessage(data.message || "Hubo un error en el registro");
      }
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      setErrorMessage("Hubo un error en el registro");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow mb-8">
      <form
        className="bg-login-register p-8 rounded shadow-md sm:w-96 w-full"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-black">Registro</h2>
        {errorMessage && (
          <div className="text-red-500 mb-4">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="text-green-500 mb-4">{successMessage}</div>
        )}
        <div className="mb-4">
          <label
            className="block text-black text-sm font-semibold mb-2"
            htmlFor="username"
          >
            Nombre de usuario
          </label>
          <input
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-300"
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-black text-sm font-semibold mb-2"
            htmlFor="email"
          >
            Correo electrónico
          </label>
          <input
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-300"
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-black text-sm font-semibold mb-2"
            htmlFor="password-confirm"
          >
            Confirmar contraseña
          </label>
          <input
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-300"
            type="password"
            id="password-confirm"
            name="password-confirm"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
          />
        </div>
        <button className="w-full custom-button" type="submit">
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
