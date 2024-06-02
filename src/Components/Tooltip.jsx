import React, { useState } from "react";
import PropTypes from "prop-types";

const Tooltip = ({ text, children, position }) => {
  const [isVisible, setIsVisible, isToggleOn] = useState(false);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const getPositionStyles = () => {
    switch (position) {
      case "top":
        return {
          top: "calc(-100% - 8px)",
          left: "50%",
          transform: "translateX(-50%)",
        };
      case "bottom":
        return { top: "110%", left: "50%", transform: "translateX(-50%)" };
      case "left":
        return {
          top: "50%",
          left: "calc(-100% - 8px)",
          transform: "translateY(-50%)",
        };
      case "right":
        return { top: "50%", left: "100%", transform: "translateY(-50%)" };
      default:
        return { top: "100%", left: "50%", transform: "translateX(-50%)" };
    }
  };

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          className={`tooltip-content ${isToggleOn && "light-tooltip"}`}
          style={{
            position: "absolute",
            background: "#333",
            color: "#fff",
            padding: "5px",
            borderRadius: "4px",
            fontSize: "0.7rem",
            zIndex: 1,
            ...getPositionStyles(),
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
};

Tooltip.propTypes = {
  text: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  position: PropTypes.oneOf(["top", "bottom", "left", "right"]),
};

export default Tooltip;
