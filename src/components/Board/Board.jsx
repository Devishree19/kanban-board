import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Board.css";
import Column from "../Column/Column";
import Editable from "../Editable/Editable";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import BackgroundSelector from "../BackgroundSelector/BackgroundSelector";

// Import images
import img1 from "../Asserts/img1.jpg";
import img4 from "../Asserts/img4.jpg";
import img5 from "../Asserts/img5.jpg";
import img6 from "../Asserts/img6.jpg";
import img7 from "../Asserts/img7.jpg";
import img8 from "../Asserts/img8.jpg";
import img9 from "../Asserts/img9.jpg";
import img10 from "../Asserts/img10.jpg";
import img11 from "../Asserts/img11.jpg";

// List of images
const images = [img1, img4, img5, img6, img7, img8, img9, img10, img11];function Kanbanboard({ data, setData }) {
  const { boardId } = useParams();
  const board = data.boards.find(b => b.id === boardId);
  const [background, setBackground] = useState("");
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false);

  useEffect(() => {
    const savedBackground = localStorage.getItem(`background-${boardId}`);
    if (savedBackground) {
      setBackground(savedBackground);
    }
  }, [boardId]);

  const handleSetBackground = (image) => {
    setBackground(image);
    localStorage.setItem(`background-${boardId}`, image);
  };

  const handleResetBackground = () => {
    setBackground("");
    localStorage.removeItem(`background-${boardId}`);
  };

  const setName = (title, columnId) => {
    const updatedBoards = data.boards.map(b => {
      if (b.id === boardId) {
        const updatedColumns = b.columns.map(col =>
          col.id === columnId ? { ...col, name: title } : col
        );
        return { ...b, columns: updatedColumns };
      }
      return b;
    });
    setData({ ...data, boards: updatedBoards });
  };

  const dragCardInBoard = (source, destination) => {
    const updatedBoards = data.boards.map(b => {
      if (b.id === boardId) {
        const columns = [...b.columns];
        const sourceCol = columns.find(col => col.id === source.droppableId);
        const destCol = columns.find(col => col.id === destination.droppableId);

        const [movedCard] = sourceCol.cards.splice(source.index, 1);
        destCol.cards.splice(destination.index, 0, movedCard);

        return { ...b, columns };
      }
      return b;
    });
    return { boards: updatedBoards };
  };

  const dragColumn = (sourceIndex, destinationIndex) => {
    const updatedBoards = data.boards.map(b => {
      if (b.id === boardId) {
        const columns = [...b.columns];
        const [movedColumn] = columns.splice(sourceIndex, 1);
        columns.splice(destinationIndex, 0, movedColumn);
        return { ...b, columns };
      }
      return b;
    });
    return { boards: updatedBoards };
  };

  const addCard = (title, columnId) => {
    const updatedBoards = data.boards.map(b => {
      if (b.id === boardId) {
        const updatedColumns = b.columns.map(col => {
          if (col.id === columnId) {
            return {
              ...col,
              cards: [...col.cards, { id: uuidv4(), title, tags: [], tasks: [] }]
            };
          }
          return col;
        });
        return { ...b, columns: updatedColumns };
      }
      return b;
    });
    setData({ ...data, boards: updatedBoards });
  };

  const removeCard = (columnId, cardId) => {
    const updatedBoards = data.boards.map(b => {
      if (b.id === boardId) {
        const updatedColumns = b.columns.map(col => {
          if (col.id === columnId) {
            return {
              ...col,
              cards: col.cards.filter(card => card.id !== cardId)
            };
          }
          return col;
        });
        return { ...b, columns: updatedColumns };
      }
      return b;
    });
    setData({ ...data, boards: updatedBoards });
  };

  const addColumn = (title) => {
    const updatedBoards = data.boards.map(b => {
      if (b.id === boardId) {
        return {
          ...b,
          columns: [...b.columns, { id: uuidv4(), name: title, cards: [] }]
        };
      }
      return b;
    });
    setData({ ...data, boards: updatedBoards });
  };

  const removeColumn = (columnId) => {
    const updatedBoards = data.boards.map(b => {
      if (b.id === boardId) {
        return {
          ...b,
          columns: b.columns.filter(col => col.id !== columnId)
        };
      }
      return b;
    });
    setData({ ...data, boards: updatedBoards });
  };

  const onDragEnd = (result) => {
    const { source, destination, type } = result;
    if (!destination) return;

    if (type === "column") {
      setData(dragColumn(source.index, destination.index));
    } else if (type === "card") {
      if (source.droppableId === destination.droppableId) return;
      setData(dragCardInBoard(source, destination));
    }
  };

  const updateCard = (columnId, cardId, updatedCard) => {
    const updatedBoards = data.boards.map(b => {
      if (b.id === boardId) {
        const updatedColumns = b.columns.map(col => {
          if (col.id === columnId) {
            const updatedCards = col.cards.map(card =>
              card.id === cardId ? { ...card, ...updatedCard } : card
            );
            return { ...col, cards: updatedCards };
          }
          return col;
        });
        return { ...b, columns: updatedColumns };
      }
      return b;
    });
    setData({ ...data, boards: updatedBoards });
  };

  if (!board) return <div>Board not found</div>;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="app_outer" style={{ backgroundImage: `url(${background})` }}>
        <div className="header">
          <h2>{board.name}</h2>
          <button onClick={() => setShowBackgroundSelector(true)}>Background</button>
        </div>
        {showBackgroundSelector && (
          <BackgroundSelector
            setShowBackgroundSelector={setShowBackgroundSelector}
            setBackground={handleSetBackground}
            resetBackground={handleResetBackground}
            images={images} // Pass images list to BackgroundSelector
          />
        )}
        <Droppable droppableId="all-columns" direction="horizontal" type="column">
          {(provided) => (
            <div className="app_boards" ref={provided.innerRef} {...provided.droppableProps}>
              {board.columns.map((column, index) => (
                <Column
                  key={column.id}
                  id={column.id}
                  index={index}
                  name={column.name}
                  cards={column.cards}
                  setName={setName}
                  addCard={addCard}
                  removeCard={removeCard}
                  removeColumn={removeColumn}
                  updateCard={updateCard}
                />
              ))}
              {provided.placeholder}
              <div className="add-column-wrapper">
                <Editable
                  class="add__column"
                  name="Add Column"
                  btnName="Add"
                  onSubmit={addColumn}
                  placeholder="Enter Column Title"
                />
              </div>
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
}
export default Kanbanboard;