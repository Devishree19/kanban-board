// src/components/Home/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import Editable from "../Editable/Editable";
import { X } from "react-feather";
import './Home.css'

const Home = ({ boards, addBoard, deleteBoard }) => {
  const handleAddBoard = (title) => {
    addBoard(title);
  };

  return (
    <div className="home-container">
      <h1 className="home-title">My Boards</h1>
      <div className="boards-list">
        {boards.map((board) => (
          <div key={board.id} className="board-card-wrapper">
            <Link to={`/board/${board.id}`}>
              <div className="board-card">{board.name}</div>
            </Link>
            <X
              className="delete-board-icon"
              onClick={(e) => {
                e.preventDefault();
                deleteBoard(board.id);
              }}
            />
          </div>
        ))}
        <div className="add-board-wrapper">
          <Editable
            class={"add__board"}
            name={"Add Board"}
            btnName={"Add"}
            onSubmit={handleAddBoard}
            placeholder={"Enter Board Title"}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;