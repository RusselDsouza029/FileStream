import React, { useEffect, useRef, useState } from "react";
import { AppUseContext } from "../context/AppContext";
import { MdOutlineEdit } from "react-icons/md";
import DragAndDropUploader from "./DragAndDropUploader";
import AppAuth from "./AppAuth";
import { MdDeleteOutline } from "react-icons/md";
import { CiUser } from "react-icons/ci";
import { DownloadTableExcel } from "react-export-table-to-excel";
import { BiExport } from "react-icons/bi";

const UserAccount = () => {
  const {
    userStatus,
    userDetails,
    supabase,
    userEmail,
    handleShowSnackbar,
    handleHideSnackbar,
    setSnackbarValue,
  } = AppUseContext();

  const [mediaImages, setMediaImages] = useState([]);

  const [enableUploadPopup, setEnableUploadPopup] = useState(false);

  function FormatDateTimeIndia({ val }) {
    const dateObj = new Date(val);

    const formattedDate = dateObj.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const formattedTime = dateObj.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    return `${formattedDate} ${formattedTime}`;
  }

  const [mediaData, setMediaData] = useState({
    images: [],
    videos: [],
    audio: [],
    docs: [],
  });

  const hasAnyData = Object.values(mediaData).some(
    (folderData) => folderData.length > 0
  );

  function FileSizeDisplay({ sizeNum = 0 }) {
    const bytes = sizeNum;

    function bytesToSize(bytes) {
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      if (bytes === 0) return "0 Bytes";

      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024))); // convert to base-1024
      const value = (bytes / Math.pow(1024, i)).toFixed(1); // get the value with one decimal
      return `${value} ${sizes[i]}`;
    }

    const sizeString = bytesToSize(bytes);

    return <>{sizeString}</>;
  }

  let totalSize = 0;

  let acceptTypeVal = { "image/png": [".png", ".jpg", ".jpeg", ".webp"] };

  async function deleteProfile() {
    try {
      await supabase.storage
        .from("users")
        .remove(`${userEmail}/profile-image/${mediaImages[0].name}`);
      getMediaFiles();
    } catch (error) {
      handleShowSnackbar();
      handleHideSnackbar();
      setSnackbarValue("Error, please try again");
      console.log(error);
    }
  }

  async function getMediaFiles() {
    // if (mediaImages[0]) {
    //   deleteProfile();
    // }
    try {
      const { data } = await supabase.storage
        .from("users")
        .list(`${userEmail}/profile-image`);
      setMediaImages(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const folderPromises = ["images", "videos", "audio", "docs"].map(
          async (folder) => {
            const { data, error } = await supabase.storage
              .from("users")
              .list(`${userEmail}/${folder}`);
            if (error) {
              console.error("Error fetching files for", folder, error);
            } else {
              return data;
            }
          }
        );
        const fetchedData = await Promise.all(folderPromises);
        setMediaData((prevData) => ({
          ...prevData,
          images: fetchedData[0] || [],
          videos: fetchedData[1] || [],
          audio: fetchedData[2] || [],
          docs: fetchedData[3] || [],
        }));
      } catch (error) {
        console.error("Error fetching media data:", error);
      }
    };

    if (userStatus) {
      fetchData();
    }
    // eslint-disable-next-line
  }, [userStatus]);

  useEffect(() => {
    getMediaFiles();
    // eslint-disable-next-line
  }, [userStatus]);

  const tableRef = useRef();

  return (
    <>
      <div className="user-profile-container">
        {userStatus ? (
          <>
            <div className="profile-details">
              <div className="left-profile-details">
                <div className="profile-photo">
                  {mediaImages[0] ? (
                    <img
                      src={`https://xcklppdgsllqvozdzvaz.supabase.co/storage/v1/object/public/users/${userEmail}/profile-image/${mediaImages[0].name}`}
                      alt="User avatar"
                    />
                  ) : (
                    <div className="user-icon">
                      <CiUser />
                    </div>
                  )}
                  <div className="change-profile">
                    <button
                      onClick={() => {
                        setEnableUploadPopup(!enableUploadPopup);
                      }}
                    >
                      <MdOutlineEdit />
                    </button>
                    {mediaImages[0] && (
                      <button onClick={deleteProfile}>
                        <MdDeleteOutline />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="right-profile-details">
                <div className="user-profile-details">
                  <span className="user-profile-title">Name</span>
                  {userDetails.user_metadata.name}
                </div>
                <div className="user-profile-details">
                  <span className="user-profile-title">Email</span>
                  {userDetails.user_metadata.email}
                </div>
                <div className="user-profile-details">
                  <span className="user-profile-title">Account created on</span>
                  {/* {formattedDateTime} */}
                  <FormatDateTimeIndia val={userDetails.created_at} />
                </div>
              </div>
            </div>

            <div className="download-excel-btn">
              <DownloadTableExcel
                filename={userDetails.user_metadata.name}
                sheet="users"
                currentTableRef={tableRef.current}
              >
                <button>
                  <BiExport /> Export excel
                </button>
              </DownloadTableExcel>
            </div>
            <div className="table-container">
              <table ref={tableRef}>
                <thead>
                  <tr>
                    <th>Folder Name</th>
                    <th>File Name</th>
                    <th>Upload on</th>
                    <th>File Size</th>
                  </tr>
                </thead>
                <tbody>
                  {hasAnyData ? (
                    <>
                      {["images", "videos", "audio", "docs"].map((folder) => (
                        <React.Fragment key={folder}>
                          {mediaData[folder].length > 0 ? (
                            <>
                              {mediaData[folder].map((item, ind) => {
                                totalSize = item.metadata.size + totalSize;
                                return (
                                  <tr key={`${ind}-${item.name}`}>
                                    <td>{folder}</td>
                                    <td>{item.name}</td>
                                    <td>
                                      <FormatDateTimeIndia
                                        val={item.created_at}
                                      />
                                    </td>
                                    <td>
                                      <FileSizeDisplay
                                        sizeNum={item.metadata.size}
                                      />
                                    </td>
                                  </tr>
                                );
                              })}
                            </>
                          ) : null}
                        </React.Fragment>
                      ))}
                      <tr>
                        <td colSpan={3}></td>
                        <td
                          className="total-size-td"
                          style={{
                            fontWeight: "bold",
                          }}
                        >
                          Total size = <FileSizeDisplay sizeNum={totalSize} />
                        </td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td
                        style={{
                          textAlign: "center",
                          padding: 30,
                        }}
                        colSpan={4}
                      >
                        No media available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="auth-container">
            <AppAuth />
          </div>
        )}
      </div>
      <DragAndDropUploader
        disableUploadBtn={true}
        showPopup={enableUploadPopup}
        setShowPopup={setEnableUploadPopup}
        acceptTypeVal={acceptTypeVal}
        sbFolderName="profile-image"
        loadMedia={getMediaFiles}
        profileDeleteFun={deleteProfile}
      />
    </>
  );
};

export default UserAccount;
