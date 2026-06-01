import { useState } from "react";

import { login } from "../services/authService";
import { saveToken } from "../utils/auth";

function Login({ onLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [error, setError] =
    useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const data = await login(
        email,
        password
      );

      saveToken(data.token);

      onLogin();
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="view">
      <h1>Login</h1>

      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button type="submit">
          Entrar
        </button>
      </form>

      {error && (
        <p className="error">
          {error}
        </p>
      )}

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