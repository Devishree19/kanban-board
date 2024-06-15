// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import Kanbanboard from "./components/Board/Board";
import Navbar from "./components/Navbar/Navbar";
import { v4 as uuidv4 } from "uuid";
import useLocalStorage from "use-local-storage";
import "./App.css";
import "../bootstrap.css";

function App() {
  const [data, setData] = useState(
    localStorage.getItem("kanban-app")
      ? JSON.parse(localStorage.getItem("kanban-app"))
      : { boards: [] }
  );

  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useLocalStorage("theme", defaultDark ? "dark" : "light");

  const switchTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const addBoard = (title) => {
    const newBoard = {
      id: uuidv4(),
      name: title,
      columns: []
    };
    setData((prevData) => ({
      ...prevData,
      boards: [...prevData.boards, newBoard]
    }));
  };

  const deleteBoard = (boardId) => {
    setData((prevData) => ({
      ...prevData,
      boards: prevData.boards.filter((board) => board.id !== boardId)
    }));
  };

  useEffect(() => {
    localStorage.setItem("kanban-app", JSON.stringify(data));
  }, [data]);

  return (
    <Router>
      <div className="App" data-theme={theme}>
        <Navbar switchTheme={switchTheme} />
        <Routes>
          <Route
            path="/"
            element={<Home boards={data.boards} addBoard={addBoard} deleteBoard={deleteBoard} />}
          />
          <Route
            path="/board/:boardId"
            element={<Kanbanboard data={data} setData={setData} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;