import { useState } from "react";

export default function Auth({ handleLogin } : { handleLogin: (token: string) => void }) {
  const [mode, setMode] = useState("login"); // login | register
  const [login42, setLogin42] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e : any) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setLoading(true);

    try {
      // ============================
      // FETCH BACKEND ICI
      // ============================
  
      const res = await fetch(
        mode === "login" ? `${process.env.REACT_APP_BACKEND_URL}/api/auth/login` : `${process.env.REACT_APP_BACKEND_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            login : login42,
            password
          })
        }
      );

      const data = await res.json();

      if (data.succes === false) {
        console.error("Erreur backend:", data);
        throw new Error(data.message || "Erreur inconnue");
      }
      if (mode === "login") {
        handleLogin(data.token);
        setMessage({
          type: "success",
          text: "Connexion réussie ! Redirection en cours..."
        });
      } else {
        setMessage({
          type: "success",
          text: "Inscription réussie ! Vous pouvez maintenant vous connecter."
        });
        setPassword("");
        setMode("login");
      }


    } catch (err : any) {
      setMessage({
        type: "error",
        text: err.message || "Une erreur est survenue"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>{mode === "login" ? "Connexion" : "Inscription"}</h2>

        <div className="input-group">
          <label>Login 42</label>
          <input
            type="text"
            placeholder="ex: ananselm"
            value={login42}
            onChange={(e) => setLogin42(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Mot de passe</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {message.text && (
          <p className={`message ${message.type}`}>
            {message.text}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading
            ? "Chargement..."
            : mode === "login"
            ? "Se connecter"
            : "S'inscrire"}
        </button>

        <p className="switch">
          {mode === "login" ? "Pas encore de compte ?" : "Déjà un compte ?"}
          <span onClick={() => {
            setMode(mode === "login" ? "register" : "login")
            setMessage({ type: "", text: "" });
          }}>
            {mode === "login" ? " S'inscrire" : " Se connecter"}
          </span>
        </p>
      </form>
    </div>
  );
}
