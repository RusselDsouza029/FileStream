import React from "react";
import { AppUseContext } from "../context/AppContext";
import Tooltip from "./Tooltip";
import { MdDelete } from "react-icons/md";
import { FaDownload } from "react-icons/fa";
import { IoInformation } from "react-icons/io5";
import { CiStreamOn } from "react-icons/ci";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { BiLabel } from "react-icons/bi";

const MediaFeatures = ({
  loadMedia,
  children,
  folderName,
  mediaName,
  items,
  showOnHover = true,
  streamOn = false,
}) => {
  const {
    userEmail,
    supabase,
    handleAboutFlie,
    handleDownload,
    setRenameDetails,
    showRenamePopup,
    setLabelVisibility,
    setLabelDetails,
    handleShowSnackbar,
    handleHideSnackbar,
    setSnackbarValue,
  } = AppUseContext();

  function handleDelete() {
    showRenamePopup();
    setRenameDetails({
      folderName: folderName,
      currentFileName: mediaName,
    });
  }

  async function deleteMediaFromLabel() {
    try {
      const { error } = await supabase
        .from("labelsdetails")
        .delete()
        .eq("email", userEmail)
        .eq("fileName", mediaName);

      if (error) {
        console.error("Error in deleting label", error.message);
      } else {
        console.log("Label deleted successfuly");
      }
    } catch (error) {
      console.log("Getting error in deleting label media");
    }
  }

  async function deleteImageFromSupabase() {
    handleShowSnackbar();
    setSnackbarValue("Deleting...");
    try {
      const bucketName = "users";
      const imagePath = `${userEmail}/${folderName}/${mediaName}`;

      const { error } = await supabase.storage
        .from(bucketName)
        .remove([imagePath]);

      if (error) {
        console.error("Error deleting image:", error.message);
      } else {
        handleHideSnackbar();
        setSnackbarValue("Successfully Deleted");
        loadMedia();
        deleteMediaFromLabel();
      }
    } catch (error) {
      console.error(
        "Error in deleteImageFromSupabase function:",
        error.message
      );
    }
  }
  return (
    <>
      <div className="feature-container">
        {children}

        {streamOn ? <CiStreamOn /> : null}

        <div
          className={`${
            showOnHover ? `bottom-button-container` : "doc-viewer"
          }`}
        >
          <Tooltip text="Delete" position="top">
            <button onClick={deleteImageFromSupabase}>
              <MdDelete />
            </button>
          </Tooltip>
          <Tooltip text="Rename" position="top">
            <button onClick={handleDelete}>
              <MdOutlineDriveFileRenameOutline />
            </button>
          </Tooltip>
          <Tooltip text="Download" position="top">
            <button
              onClick={() => {
                handleDownload({
                  fileUrl: `https://xcklppdgsllqvozdzvaz.supabase.co/storage/v1/object/public/users/${userEmail}/images/${mediaName}`,
                  fileName: mediaName,
                });
              }}
            >
              <FaDownload />
            </button>
          </Tooltip>
          <Tooltip text="About" position="top">
            <button onClick={() => handleAboutFlie(items)}>
              <IoInformation />
            </button>
          </Tooltip>
          <Tooltip text="Label" position="top">
            <button
              onClick={() => {
                setLabelVisibility(true);
                setLabelDetails({
                  fileName: mediaName,
                  folderName: folderName,
                });
              }}
            >
              <BiLabel />
            </button>
          </Tooltip>
        </div>
      </div>
    </>
  );
};

export default MediaFeatures;
