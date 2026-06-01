import { useState } from "react";

import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import SectionsView from "./pages/SectionsView";
import TasksView from "./pages/TasksView";

import {
  isAuthenticated,
  removeToken,
} from "./utils/auth";

function App() {
  const [authenticated, setAuthenticated] =
    useState(isAuthenticated());

  const [showRegister, setShowRegister] =
    useState(false);

  const [section, setSection] =
    useState(null);

  function handleLogin() {
    setAuthenticated(true);
  }

  function handleLogout() {
    removeToken();

    setAuthenticated(false);
    setSection(null);
  }

  if (!authenticated) {
    return (
      <div className="app">
        {showRegister ? (
          <Register
            onSuccess={() =>
              setShowRegister(false)
            }
            onLogin={() =>
              setShowRegister(false)
            }
          />
        ) : (
          <Login
            onLogin={handleLogin}
            onRegister={() =>
              setShowRegister(true)
            }
          />
        )}
      </div>
    );
  }

  return (
    <div className="app">
      <button
        className="btn-back"
        onClick={handleLogout}
      >
        Cerrar sesión
      </button>

      {section === null ? (
        <SectionsView
          onOpen={setSection}
        />
      ) : (
        <TasksView
          section={section}
          onBack={() =>
            setSection(null)
          }
        />
      )}
    </div>
  );
}

export default App;