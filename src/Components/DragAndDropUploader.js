import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaUpload } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { AppUseContext } from "../context/AppContext";

const DragAndDropUploader = ({
  disableUploadBtn = false,
  acceptTypeVal = { "image/png": [".png", ".jpg", ".jpeg", ".webp"] },
  sbFolderName = "images",
  dndAcceptText = "only upload .png .jpg .jpeg or webp",
  loadMedia,
  setShowPopup,
  showPopup = false,
  profileDeleteFun,
}) => {
  const {
    userId,
    userEmail,
    supabase,
    handleShowSnackbar,
    handleHideSnackbar,
    setSnackbarValue,
  } = AppUseContext();
  const [uploadPopup, setUploadPopup] = useState(showPopup);

  const onDrop = useCallback(
    (acceptedFiles) => {
      // Handle the dropped files
      if (acceptedFiles.length > 0) {
        handleFileUpload(acceptedFiles);
        handleShowSnackbar();
        setSnackbarValue("Uploading...");
      }
    },
    // eslint-disable-next-line
    [handleFileUpload]
  );

  useEffect(() => {
    setUploadPopup(showPopup);
  }, [showPopup]);

  async function handleFileUpload(file) {
    showPopup && profileDeleteFun();

    handleUploadPopup();
    const { data, error } = await supabase.storage
      .from("users")
      .upload(userEmail + `/${sbFolderName}/` + file[0].name, file[0]);

    if (data) {
      loadMedia();
      handleHideSnackbar();
      setSnackbarValue("Successfully Uploaded");
    } else {
      console.log(error.message);
      handleHideSnackbar();
      setSnackbarValue("Error fialed to upload, please try again");
    }
  }

  const handleUploadPopup = () => {
    setUploadPopup(!uploadPopup);
    showPopup && setShowPopup(false);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    // accept: {
    //   acceptType: [...acceptTypeVal],
    // },

    accept: acceptTypeVal,
  });

  return (
    <>
      {!disableUploadBtn && (
        <button
          onClick={handleUploadPopup}
          className="upload-btn"
          disabled={userId === "" ? true : false}
        >
          <span>
            <FaUpload />
          </span>
          Upload
        </button>
      )}
      {uploadPopup ? (
        <div className="upload-popup-container">
          <div className="upload-box">
            <button className="close-popup" onClick={handleUploadPopup}>
              <IoMdClose />
            </button>
            <div className="drag-and-drop-uploader" {...getRootProps()}>
              <input
                {...getInputProps()}
                accept="image/png, image/gif, image/jpeg"
              />
              <p>
                Drag & Drop, or click here to select
                <br />
                <em>{dndAcceptText}</em>
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default DragAndDropUploader;
