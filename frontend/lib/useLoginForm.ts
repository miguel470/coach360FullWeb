import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Cookies from "js-cookie";

interface FormData {
  identifier: string;
  password: string;
}

const useLoginForm = () => {
  const [formData, setFormData] = useState<FormData>({
    identifier: "",
    password: "",
  });

  const [redirect, setRedirect] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log(process.env.NEXT_PUBLIC_API_URL + "/api/auth/local");
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/auth/local",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        setErrorMessage("Usuario o contraseña incorrecta");
        return;
      }

      const responseData = await response.json();
      console.log("Usuario autenticado:", responseData);

      Cookies.set("authToken", responseData.jwt);
      setRedirect(true);
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      setErrorMessage("Error en la solicitud");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const authToken = Cookies.get("authToken");

    if (authToken && redirect) {
      window.location.href = "/";
    }
  }, [redirect]);

  return { formData, errorMessage, loading, handleInputChange, handleLogin };
};

export default useLoginForm;
