import React from "react";

const LoadingComponent = ({ lineContainer }) => {
  return (
    <>
      {[0, 1, 2].map((arr) => {
        return (
          <div
            className={`${
              lineContainer === "" ? "" : lineContainer
            } loading-box`}
            key={arr}
          >
          </div>
        );
      })}
    </>
  );
};

export default LoadingComponent;
