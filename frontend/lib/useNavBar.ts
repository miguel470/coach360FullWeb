import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const useNavBar = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const authToken = Cookies.get("authToken");
    setIsLoggedIn(!!authToken);
  }, []);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleLogout = () => {
    Cookies.remove("authToken");
    setIsLoggedIn(false);
    window.location.href = "/login";
  };

  return { menuVisible, toggleMenu, isLoggedIn, handleLogout };
};

export default useNavBar;
