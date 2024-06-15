import React, { useState } from "react";
import Card from "../Card/Card";
import "./Column.css";
import { MoreHorizontal } from "react-feather";
import Editable from "../Editable/Editable";
import Dropdown from "../Dropdown/Dropdown";
import { Droppable, Draggable } from "react-beautiful-dnd";

export default function Column(props) {
  const [show, setShow] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  return (
    <Draggable draggableId={props.id.toString()} index={props.index}>
      {(provided) => (
        <div
          className="board"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div className="board__top">
            {show ? (
              <div>
                <input
                  className="title__input"
                  type="text"
                  defaultValue={props.name}
                  onChange={(e) => {
                    props.setName(e.target.value, props.id);
                  }}
                  onBlur={() => setShow(false)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") setShow(false);
                  }}
                  autoFocus
                />
              </div>
            ) : (
              <div>
                <p
                  onClick={() => {
                    setShow(true);
                  }}
                  className="board__title"
                >
                  {props?.name || "Name of Column"}
                  {/* <span className="total__cards">{props.cards?.length}</span> */}
                </p>
              </div>
            )}
            <div
              onClick={() => {
                setDropdown(true);
              }}
            >
              <MoreHorizontal />
              {dropdown && (
                <Dropdown
                  class="board__dropdown"
                  onClose={() => {
                    setDropdown(false);
                  }}
                >
                  <p onClick={() => props.removeColumn(props.id)}>Delete Column</p>
                </Dropdown>
              )}
            </div>
          </div>
          <Droppable droppableId={props.id.toString()} type="card">
            {(provided) => (
              <div
                className="board__cards"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {props.cards?.map((card, index) => (
                  <Card
                    key={card.id}
                    columnId={props.id}
                    id={card.id}
                    index={index}
                    card={card}
                    updateCard={props.updateCard}
                    removeCard={props.removeCard}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <div className="board__footer">
            <Editable
              name="Add Card"
              btnName="Add Card"
              placeholder="Enter Card Title"
              onSubmit={(value) => props.addCard(value, props.id)}
            />
          </div>
        </div>
      )}
    </Draggable>
  );
}