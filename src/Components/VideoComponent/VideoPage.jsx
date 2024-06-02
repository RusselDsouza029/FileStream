import React, { useEffect, useState } from "react";
import "../../styles/Main.scss";
import DragAndDropUploader from "../DragAndDropUploader";
import { useLocation } from "react-router-dom";
import { AppUseContext } from "../../context/AppContext";
import LoadingComponent from "../LoadingComponent";
import VideoPopup from "../VideoPopup";
import MediaFeatures from "../MediaFeatures";
import AppAuth from "../AppAuth";
import FileNotFound from "../FileNotFound";

const VideoComponent = () => {
  const {
    userEmail,
    supabase,
    userStatus,
    setIsRename,
    isRename,
  } = AppUseContext();
  const [videoPopupState, setVideoPopupState] = useState(false);
  const [vidMediaData, setVidMediaData] = useState();

  const pathname = useLocation();

  const [mediaData, setMediaData] = useState([]);
  const [loadingSekeleton, setLoadingSekeleton] = useState(true);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  async function getMediaFiles() {
    try {
      const { data } = await supabase.storage
        .from("users")
        .list(`${userEmail}/videos`);
      setMediaData(data);
      setTimeout(() => {
        setLoadingSekeleton(false);
      }, [2000]);
      setIsRename(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getMediaFiles();
    window.scrollTo(0, 0);
    // eslint-disable-next-line
  }, [pathname, userStatus]);

  useEffect(() => {
    getMediaFiles();
    // eslint-disable-next-line
  }, [isRename]);

  let acceptTypeVal = { "video/mp4": [".mp4"] };

  const handleCloseVideoState = () => {
    setVideoPopupState(false);
  };
  return (
    <>
      <div className="component">
        <div className="top-function">
          <DragAndDropUploader
            sbFolderName="videos"
            acceptTypeVal={acceptTypeVal}
            dndAcceptText="only upload .mp4"
            loadMedia={getMediaFiles}
          />
        </div>
        <div className="content-box">
          {!userStatus ? (
            <div className="auth-container">
              <AppAuth />
            </div>
          ) : (
            <div className="file-container">
              {loadingSekeleton ? (
                <LoadingComponent />
              ) : (
                <>
                  {mediaData[0] ? (
                    <>
                      {mediaData.map((mediaItem) => {
                        return (
                          <div key={mediaItem.name} className="media-items">
                            <MediaFeatures
                              folderName="videos"
                              mediaName={mediaItem.name}
                              items={mediaItem}
                              loadMedia={getMediaFiles}
                            >
                              <video
                                onClick={() => {
                                  setVideoPopupState(!videoPopupState);
                                  setVidMediaData(mediaItem.name);
                                }}
                              >
                                <source
                                  src={`https://xcklppdgsllqvozdzvaz.supabase.co/storage/v1/object/public/users/${userEmail}/videos/${mediaItem.name}`}
                                />
                              </video>
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
            </div>
          )}
        </div>
        <VideoPopup
          videoState={videoPopupState}
          videoMedia={vidMediaData}
          videoStateFun={handleCloseVideoState}
          allVideoMedia={mediaData}
        />
      </div>
    </>
  );
};

export default VideoComponent;
