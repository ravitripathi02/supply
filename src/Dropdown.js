import React, { useState } from "react";
import "./styles.css";

function Dropdown(props) {
  const [isOpen, setIsOpen] = useState(false);

  const stateFromProps = props.state;
  const onOptionSelect = props.selectedState;
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const handleOptionClick = (option) => {
    onOptionSelect(option);
    toggleDropdown(); // Close the dropdown after an option is selected
  };
  //   console.log(nonNullKeys);
  return (
    <div className="dropdown">
      <button className="dropdown-toggle" onClick={toggleDropdown}>
        Select an option
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          {Object.keys(stateFromProps).map(
            (state) =>
              state !== "" && (
                <li key={state} onClick={() => handleOptionClick(state)}>
                  {state}
                </li>
              ),
          )}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
