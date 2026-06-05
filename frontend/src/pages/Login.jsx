import { useState } from "react";
import { login } from "../services/authService";
import { saveToken } from "../utils/auth";

function Login({ onLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      return setError(
        "Debes ingresar un correo."
      );
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return setError(
        "El correo no tiene un formato válido."
      );
    }

    if (!password.trim()) {
      return setError(
        "Debes ingresar una contraseña."
      );
    }

    try {
      setLoading(true);

      const data = await login(
        email,
        password
      );

      saveToken(data.token);

      onLogin();
    } catch (error) {
      setError(
        error.message ||
          "Error al iniciar sesión."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="view">
      <h1>Login</h1>

      <form
        noValidate
        className="auth-form"
        onSubmit={handleSubmit}
      >
        <input
          className="auth-input"
          type="text"
          placeholder="Correo"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Ingresando..."
            : "Entrar"}
        </button>
      </form>

      <button
        className="btn-back"
        onClick={onRegister}
      >
        Crear cuenta
      </button>
    </div>
  );
}

export default Login;