import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import { AppUseContext } from "../context/AppContext";
import AvailableLabelComponent from "./AvailableLabelComponent";

const AboutFile = ({ aboutFun, aboutFileState, fileDetails }) => {
  const { isToggleOn } = AppUseContext();
  // const { AvailableLabelComponent } = AppUseContext();
  const [fileSize, setFileSize] = useState();
  const timestamp = aboutFileState ? fileDetails[0].created_at : null;
  const date = new Date(timestamp);

  // Create a readable date string
  const readableDate = date.toLocaleString();

  function formatFileSize(size) {
    const units = ["Bytes", "KB", "MB", "GB", "TB"];

    let unitIndex = 0;
    while (size > 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return setFileSize(size.toFixed(2) + " " + units[unitIndex]);
  }

  const fileName = aboutFileState ? fileDetails[0].name : "";
  const fileNameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");

  const fileType = aboutFileState
    ? fileDetails[0].metadata.mimetype.split("/")[1]
    : "";

  function handleFileType(mimeType) {
    const mappings = {
      msword: "Microsoft Word Document (.doc)",
      "vnd.openxmlformats-officedocument.wordprocessingml.document":
        "Microsoft Word Document (.docx)",
      pdf: "PDF Document (.pdf)",
      "vnd.ms-powerpoint": "Microsoft PowerPoint Presentation (.ppt, .pptx)",
      "vnd.ms-excel": "Microsoft Excel Spreadsheet (.xls, .xlsx)",
      "vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        "Microsoft Excel Spreadsheet (.xls, .xlsx)",
    };

    return mappings[mimeType] || fileType.toUpperCase();
  }

  useEffect(() => {
    document.body.style.overflow = aboutFileState ? "hidden" : "auto";
    formatFileSize(aboutFileState ? fileDetails[0].metadata.size : 0);
    // eslint-disable-next-line
  }, [aboutFileState]);

  const variants = {
    open: { x: 0 },
    closed: { x: "100%" },
  };

  return (
    <>
      <AnimatePresence>
        {aboutFileState && (
          <div
            className={`about-file-container ${
              isToggleOn && "about-file-container-light"
            }`}
          >
            <div className="back-close" onClick={aboutFun}></div>
            <motion.div
              className="about-file-content"
              initial="closed"
              animate="open"
              exit="closed"
              variants={variants}
              transition={{
                duration: 0.3,
              }}
            >
              <div className="about-title">
                <button onClick={aboutFun}>
                  <IoMdClose />
                </button>
                <p>Details</p>
              </div>
              <p>
                <span>Name</span> <br />
                {fileNameWithoutExtension}
              </p>
              <p>
                <span>Time</span> <br /> {readableDate}
              </p>
              <p>
                <span>Size</span> <br /> {fileSize}
              </p>
              <p>
                <span>File type</span> <br /> {handleFileType(fileType)}
              </p>
              <AvailableLabelComponent fileName={fileName} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AboutFile;
