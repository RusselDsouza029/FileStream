import React from "react";
import { CiFileOff } from "react-icons/ci";

const FileNotFound = () => {
  return (
    <div className="no-file-found-container">
      <CiFileOff />
      <p>FIle not found</p>
    </div>
  );
};

export default FileNotFound;
