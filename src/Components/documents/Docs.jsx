import React, { useEffect, useState } from "react";
// import { AppUseContext } from "../../context/AppContext";
import "../../styles/Main.scss";
import DragAndDropUploader from "../DragAndDropUploader";
import { AppUseContext } from "../../context/AppContext";
// import VideoPlayer from "./VideoPlayer";
import LoadingComponent from "../LoadingComponent";
import MediaFeatures from "../MediaFeatures";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { IoMdClose } from "react-icons/io";
import { IoDocumentTextOutline } from "react-icons/io5";
import AppAuth from "../AppAuth";
import FileNotFound from "../FileNotFound";

const Docs = () => {
  const {
    userEmail,
    supabase,
    userId,
    setIsRename,
    isRename,
  } = AppUseContext();
  const [openCloseDocs, setOpenCloseDocs] = useState(false);
  const [docName, setDocName] = useState();

  const [fileSizes, setFileSizes] = useState([]);

  const [fileDates, setFileDates] = useState([]);
  const [mediaData, setMediaData] = useState([]);
  const [loadingSekeleton, setLoadingSekeleton] = useState(true);

  async function getMediaFiles() {
    try {
      const { data } = await supabase.storage
        .from("users")
        .list(`${userEmail}/docs`);
      setMediaData(data);
      setTimeout(() => {
        setLoadingSekeleton(false);
      }, [2000]);
      setIsRename(false);
    } catch (error) {
      console.log(error);
    }
  }

  const docs = [
    {
      uri: `https://xcklppdgsllqvozdzvaz.supabase.co/storage/v1/object/public/users/russeldsouza456@gmail.com/docs/${docName}`,
    },
  ];
  function handleDocOpenClose() {
    setOpenCloseDocs(!openCloseDocs);
  }

  const formatFileDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    const formattedDate = new Date(dateString).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  };

  const formatFileSize = (sizeInBytes) => {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (sizeInBytes === 0) return "0 Byte";
    const i = parseInt(Math.floor(Math.log(sizeInBytes) / Math.log(1024)));
    return Math.round(sizeInBytes / Math.pow(1024, i), 2) + " " + sizes[i];
  };

  useEffect(() => {
    const fetchFileSizesAndDates = async () => {
      const sizeDatePromises = mediaData.map(async (mediaItem) => {
        const [response, blob] = await Promise.all([
          fetch(
            `https://xcklppdgsllqvozdzvaz.supabase.co/storage/v1/object/public/users/${userEmail}/docs/${mediaItem.name}`
          ),
          fetch(
            `https://xcklppdgsllqvozdzvaz.supabase.co/storage/v1/object/public/users/${userEmail}/docs/${mediaItem.name}`
          ).then((response) => response.blob()),
        ]);

        const size = blob.size;
        const date = response.headers.get("last-modified");

        return { size, date };
      });

      const sizesAndDates = await Promise.all(sizeDatePromises);

      const sizes = sizesAndDates.map((item) => item.size);
      const dates = sizesAndDates.map((item) => item.date);

      setFileSizes(sizes);
      setFileDates(dates);
    };

    fetchFileSizesAndDates();
  }, [mediaData, userEmail]);

  useEffect(() => {
    getMediaFiles();
    // eslint-disable-next-line
  }, [userEmail, isRename]);

  let acceptTypeVal = {
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
    "application/pdf": [".pdf"],
    "application/vnd.ms-powerpoint": [".ppt", ".pptx"],
    "application/vnd.ms-excel": [".xls", ".xlsx"],
  };

  return (
    <>
      <div className="component">
        <div className="top-function">
          <DragAndDropUploader
            sbFolderName="docs"
            acceptTypeVal={acceptTypeVal}
            dndAcceptText="only upload .pdf, .ppt, and .pptx"
            loadMedia={getMediaFiles}
          />
        </div>
        <div className="content-box">
          {userId === "" ? (
            <div className="auth-container">
              <AppAuth />
            </div>
          ) : (
            <div className="file-container">
              {loadingSekeleton ? (
                <LoadingComponent lineContainer="line-loading-container" />
              ) : (
                <>
                  {mediaData[0] ? (
                    <>
                      {mediaData.map((mediaItem, ind) => {
                        return (
                          <div
                            key={mediaItem.name}
                            className="media-items music-container"
                          >
                            <MediaFeatures
                              folderName="docs"
                              mediaName={mediaItem.name}
                              items={mediaItem}
                              loadMedia={getMediaFiles}
                            >
                              <span className="music-content-icon">
                                <IoDocumentTextOutline />
                              </span>
                              <span
                                className="music-content music-name"
                                onClick={() => {
                                  setDocName(mediaItem.name);
                                  handleDocOpenClose();
                                }}
                              >
                                {mediaItem.name}
                              </span>
                              <span className="music-content">
                                {formatFileSize(fileSizes[ind])}
                              </span>
                              <span className="music-content">
                                {formatFileDate(fileDates[ind])}
                              </span>
                            </MediaFeatures>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <FileNotFound />
                  )}
                </>
              )}
              {openCloseDocs ? (
                <div className="doc-viewer-popup">
                  <div className="doc-features">
                    <button onClick={handleDocOpenClose}>
                      <IoMdClose />
                    </button>
                  </div>
                  <DocViewer
                    documents={docs}
                    pluginRenderers={DocViewerRenderers}
                    theme={{
                      primary: "#5296d8",
                      secondary: "#ffffff",
                      tertiary: "#5296d899",
                      textPrimary: "#ffffff",
                      textSecondary: "#5296d8",
                      textTertiary: "#00000099",
                      disableThemeScrollbar: false,
                    }}
                  />
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Docs;
