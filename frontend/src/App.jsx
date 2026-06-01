import { useState, useEffect } from "react";
import "./App.css";

const API = "/api";

import "./App.css";

import SectionsView from "./pages/SectionsView";
import TasksView from "./pages/TasksView";

function App() {
  const [section, setSection] = useState(null);

  return (
    <div className="app">
      {section === null ? (
        <SectionsView onOpen={setSection} />
      ) : (
        <TasksView
          section={section}
          onBack={() => setSection(null)}
        />
      )}
    </div>
  );
}

export default App;