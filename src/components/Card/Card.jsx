// src/components/Card/Card.jsx

import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { CheckSquare, MoreHorizontal } from "react-feather";
import Dropdown from "../Dropdown/Dropdown";
import Tag from "../Tags/Tag";
import "./Card.css";
import CardDetails from "./CardDetails/CardDetails";

const Card = (props) => {
  const [dropdown, setDropdown] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  return (
    <Draggable
      key={props.id.toString()}
      draggableId={props.id.toString()}
      index={props.index}
    >
      {(provided) => (
        <>
          {modalShow && (
            <CardDetails
              card={props.card}
              onClose={() => setModalShow(false)}
              updateCard={props.updateCard}
              columnId={props.columnId}
              removeCard={props.removeCard}
            />
          )}
          <div
            className="custom__card"
            onClick={() => setModalShow(true)}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <div className="card__text">
              <p>{props.card.title}</p>
              <MoreHorizontal
                className="car__more"
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdown(true);
                }}
              />
              {dropdown && (
                <Dropdown
                  class="card__dropdown"
                  onClose={() => setDropdown(false)}
                >
                  <p onClick={() => props.removeCard(props.columnId, props.id)}>Delete Card</p>
                </Dropdown>
              )}
            </div>
            <div className="card__tags">
              {props.card.labels?.map((item, index) => (
                <Tag key={index} tagName={item.text} color={item.color} />
              ))}
            </div>
            <div className="card__footer">
              {props.card.tasks && props.card.tasks.length > 0 && (
                <div className="task">
                  <CheckSquare />
                  <span>
                    {`${props.card.tasks.filter((task) => task.completed).length} / ${props.card.tasks.length}`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </Draggable>
  );
};

export default Card;