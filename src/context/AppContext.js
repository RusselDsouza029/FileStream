import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import AboutFile from "../Components/AboutFile";
import { AnimatePresence, motion } from "framer-motion";

const AppCreateContext = createContext();
const AppUrl = process.env.REACT_APP_URL;
const AppKey = process.env.REACT_APP_KEY;

const supabase = createClient(AppUrl, AppKey);

export const AppContextProvider = ({ children }) => {
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userDetails, setUserDetails] = useState({});
  const [userStatus, setUserStatus] = useState(false);
  const [aboutFileShow, setAboutFileShow] = useState(false);
  const [aboutFileDetails, setAboutFileDetails] = useState([]);
  const [renamePopup, setRenamePopup] = useState(false);
  const [renameDetails, setRenameDetails] = useState({
    folderName: "",
    currentFileName: "",
    renameFileName: "",
  });
  const [labelName, setLabelName] = useState("");
  const [labelVisibility, setLabelVisibility] = useState(false);
  const [labelDetails, setLabelDetails] = useState({
    fileName: "",
    folderName: "",
  });

  const [snackbar, setSnackBar] = useState(false);

  const [snackbarValue, setSnackbarValue] = useState("");

  const [checkSideMenu, setCheckSideMenu] = useState(true);

  const [isRename, setIsRename] = useState(false);

  const [isToggleOn, setIsToggleOn] = useState(true);

  // below code to check theme
  useEffect(() => {
    const themeDetect = window.matchMedia("(prefers-color-scheme: light)");

    const localstorageTheme = localStorage.getItem("themeVal");

    if (localstorageTheme !== null) {
      if (localstorageTheme === "dark") {
        setIsToggleOn(false);
      } else {
        setIsToggleOn(true);
      }
    } else {
      if (themeDetect.matches) {
        setIsToggleOn(true);
      } else {
        setIsToggleOn(false);
      }
    }
  }, []);

  useEffect(() => {
    document.body.className = isToggleOn && "body-light";
  }, [isToggleOn]);

  const handleShowSnackbar = () => {
    setSnackBar(true);
  };

  const handleHideSnackbar = () => {
    setTimeout(() => {
      setSnackBar(false);
    }, 2000);
  };

  const handleDownload = async ({ fileUrl, fileName }) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  const handleAboutFlie = (fileData) => {
    setAboutFileShow(!aboutFileShow);
    setAboutFileDetails([fileData]);
  };

  const showRenamePopup = () => {
    setRenamePopup(!renamePopup);
  };

  async function deleteLabelItem() {
    const { data, error } = await supabase
      .from("labelsdetails")
      .delete()
      .eq("email", userEmail)
      .eq("fileName", renameDetails.currentFileName);

    if (error) {
      console.error("Error deleting label:", error);
    } else {
      console.log("Label deleted successfully:", data);
    }
  }

  async function handleRenameFile() {
    if (renameDetails.renameFileName === undefined) {
      alert("Please fill input");
    } else {
      try {
        await supabase.storage
          .from("users")
          .move(
            userEmail +
              `/${renameDetails.folderName}/` +
              `${renameDetails.currentFileName}`,
            userEmail +
              `/${renameDetails.folderName}/` +
              `${renameDetails.renameFileName}`
          );
        deleteLabelItem();
        showRenamePopup();
        handleShowSnackbar();
        setSnackbarValue("Name changed successfully");
        handleHideSnackbar();
        setIsRename(true);
      } catch (error) {
        console.error("Error in delete function:", error.message);
      }
    }
  }

  const getUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user !== null) {
        setUserEmail(user.email);
        setUserId(user.id);
        setUserDetails(user);
      } else {
        setUserId("");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getUser();
    if (userDetails.aud === "authenticated") {
      setUserStatus(true);
    } else setUserStatus(false);
    // eslint-disable-next-line
  }, [userId]);

  const signout = async () => {
    setUserId("");
    await supabase.auth.signOut();
    setUserStatus(false);
  };

  const createLabelData = async () => {
    const { error } = await supabase.from("labelsdetails").insert([
      {
        email: userEmail,
        labelname: labelName,
        fileName: labelDetails.fileName,
        folderName: labelDetails.folderName,
      },
    ]);

    if (error) {
      console.error("Error inserting labels:", error);
    } else {
      setSnackbarValue("Successfuly added into label");
      setSnackBar(true);
      setLabelVisibility(false);
      handleHideSnackbar();
    }
  };

  const snackbarVariants = {
    open: { x: 0 },
    close: { x: "-100%" },
  };

  return (
    <AppCreateContext.Provider
      value={{
        userId,
        userEmail,
        signout,
        supabase,
        userDetails,
        userStatus,
        handleAboutFlie,
        setAboutFileShow,
        handleDownload,
        setRenameDetails,
        showRenamePopup,
        setLabelVisibility,
        setLabelDetails,
        setSnackBar,
        setSnackbarValue,
        handleShowSnackbar,
        handleHideSnackbar,
        checkSideMenu,
        setCheckSideMenu,
        setIsRename,
        isRename,
        isToggleOn,
        setIsToggleOn,
      }}
    >
      {children}
      <AboutFile
        aboutFileState={aboutFileShow}
        aboutFun={handleAboutFlie}
        fileDetails={aboutFileDetails}
      />
      {renamePopup && (
        <div className="rename-container">
          <div className="dv-rename">
            <input
              type="text"
              autoFocus
              onChange={(e) => {
                setRenameDetails({
                  folderName: renameDetails.folderName,
                  currentFileName: renameDetails.currentFileName,
                  renameFileName: e.target.value,
                });
              }}
            />
            <button
              onClick={() => {
                handleRenameFile({
                  folderName: renameDetails.folderName,
                  currentFileName: renameDetails.currentFileName,
                  renameFileName: renameDetails.renameFileName,
                });
              }}
            >
              Rename
            </button>
            <button onClick={showRenamePopup}>Close</button>
          </div>
        </div>
      )}

      {labelVisibility && (
        <div className="label-popup-container">
          <div className="label-component">
            <input autoFocus onChange={(e) => setLabelName(e.target.value)} />
            <button onClick={createLabelData}>Add</button>
            <button onClick={() => setLabelVisibility(false)}>Close</button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {snackbar && (
          <motion.div
            className="snackbar-container"
            variants={snackbarVariants}
            animate="open"
            exit="close"
            initial="close"
            transition={{
              duration: 0.3,
            }}
          >
            <span>{snackbarValue}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </AppCreateContext.Provider>
  );
};

export function AppUseContext() {
  return useContext(AppCreateContext);
}
