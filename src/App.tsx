import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Auth from "./pages/AuthPage";
import { IUser } from "./types/models/IUser";
import LoadingPage from "./pages/LoadingPage";
import DashboardPage from "./pages/DashboardPage";

type AuthStatus = "loading" | "unauthenticated" | "authenticated";

function App() {
  const [user, setUser] = useState<IUser | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    const token = Cookies.get("auth_token");

    if (!token) {
      setAuthStatus("unauthenticated");
      return;
    }
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (res.status === 200) {
          setAuthStatus("authenticated");
          return res.json();
        } else {
          setAuthStatus("unauthenticated");
        }
      })
      .then(data => {
        setUser(data.user);
      })
      .catch(() => {
        setAuthStatus("unauthenticated");
        Cookies.remove("auth_token");
      });
  }, []);

  const handleLogin = (token: string) => {
    setAuthStatus("loading");
    Cookies.set("auth_token", token, { expires: 7, secure: true, sameSite: "strict" });
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
      })
      .catch(err => {
        console.error("Erreur lors de la récupération de l'utilisateur:", err);
      });
    setAuthStatus("authenticated");
  };

  if (authStatus === "loading") {
    return <LoadingPage />;
  }

  if (authStatus === "unauthenticated") {
    return <Auth handleLogin={handleLogin} />;
  }

  if (authStatus === "authenticated" && user) {
    return <DashboardPage user={user} />;
  }

  return <LoadingPage />;
}

export default App;
