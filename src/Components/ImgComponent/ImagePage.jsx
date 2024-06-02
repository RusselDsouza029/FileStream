import React, { useEffect, useState } from "react";
import { AppUseContext } from "../../context/AppContext";
import "../../styles/ImgComponent.scss";
import DragAndDropUploader from "../DragAndDropUploader";
import Fancybox from "./Fancybox";
import LoadingComponent from "../LoadingComponent";
import MediaFeatures from "../MediaFeatures";
import { useLocation } from "react-router-dom";
import AppAuth from "../AppAuth";
import FileNotFound from "../FileNotFound";

const ImgComponent = () => {
  const {
    userEmail,
    supabase,
    userStatus,
    setIsRename,
    isRename,
  } = AppUseContext();

  const pathname = useLocation();

  const [mediaData, setMediaData] = useState([]);
  const [loadingSekeleton, setLoadingSekeleton] = useState(true);

  async function getMediaFiles() {
    try {
      const { data } = await supabase.storage
        .from("users")
        .list(`${userEmail}/images`);
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
  }, [userStatus, pathname, isRename]);

  let acceptTypeVal = { "image/png": [".png", ".jpg", ".jpeg", ".webp"] };
  return (
    <>
      <div className="component">
        <div className="top-function">
          <DragAndDropUploader
            sbFolderName="images"
            acceptTypeVal={acceptTypeVal}
            loadMedia={getMediaFiles}
          />
        </div>
        <div className="content-box">
          {!userStatus ? (
            <div className="auth-container">
              <AppAuth />
            </div>
          ) : (
            <>
              <Fancybox
                options={{
                  Carousel: {
                    infinite: false,
                  },
                }}
              >
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
                                  folderName="images"
                                  mediaName={mediaItem.name}
                                  items={mediaItem}
                                  loadMedia={getMediaFiles}
                                >
                                  <a
                                    data-fancybox="gallery"
                                    href={`https://xcklppdgsllqvozdzvaz.supabase.co/storage/v1/object/public/users/${userEmail}/images/${mediaItem.name}`}
                                    onClick={(e) => e.preventDefault()}
                                  >
                                    <img
                                      src={`https://xcklppdgsllqvozdzvaz.supabase.co/storage/v1/object/public/users/${userEmail}/images/${mediaItem.name}`}
                                      width="200px"
                                      alt={mediaItem.name}
                                    />
                                  </a>
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
              </Fancybox>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ImgComponent;
