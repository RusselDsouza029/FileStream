import React, { useEffect, useState } from "react";
import "../../styles/Main.scss";
import DragAndDropUploader from "../DragAndDropUploader";
import { useLocation } from "react-router-dom";
import { AppUseContext } from "../../context/AppContext";
import LoadingComponent from "../LoadingComponent";
import MediaFeatures from "../MediaFeatures";
import PlayerApp from "./PlayerApp";
import { CiMusicNote1 } from "react-icons/ci";
import AppAuth from "../AppAuth";
import FileNotFound from "../FileNotFound";

const Music = () => {
  const {
    userEmail,
    supabase,
    userId,
    setIsRename,
    isRename,
  } = AppUseContext();
  const [getAudioNum, setGetAudioNum] = useState(0);
  const [playAudio, setPlayAudio] = useState(false);

  const [fileSizes, setFileSizes] = useState([]);

  const [fileDates, setFileDates] = useState([]);

  const [mediaData, setMediaData] = useState([]);
  const [loadingSekeleton, setLoadingSekeleton] = useState(true);
  const pathname = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  async function getMediaFiles(fileType) {
    try {
      const { data } = await supabase.storage
        .from("users")
        .list(`${userEmail}/audio`);
      setMediaData(data);
      setTimeout(() => {
        setLoadingSekeleton(false);
      }, [2000]);
      setIsRename(false);
    } catch (error) {
      console.log(error);
    }
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
            `https://xcklppdgsllqvozdzvaz.supabase.co/storage/v1/object/public/users/${userEmail}/audio/${mediaItem.name}`
          ),
          fetch(
            `https://xcklppdgsllqvozdzvaz.supabase.co/storage/v1/object/public/users/${userEmail}/audio/${mediaItem.name}`
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

  let acceptTypeVal = { "music/mp3": [".mp3", ".wav"] };

  return (
    <>
      <div className="component">
        <div className="top-function">
          <DragAndDropUploader
            sbFolderName="audio"
            acceptTypeVal={acceptTypeVal}
            dndAcceptText="only upload .mp3"
            loadMedia={getMediaFiles}
          />
        </div>
        <div className="content-box">
          {userId === "" ? (
            <div className="auth-container">
              <AppAuth />
            </div>
          ) : (
            <>
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
                                folderName="audio"
                                mediaName={mediaItem.name}
                                items={mediaItem}
                                loadMedia={getMediaFiles}
                              >
                                <span className="music-content-icon">
                                  <CiMusicNote1 />
                                </span>
                                <span
                                  className="music-content music-name"
                                  onClick={() => {
                                    setGetAudioNum(ind);
                                    setPlayAudio(true);
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
              </div>
            </>
          )}
        </div>
      </div>
      <PlayerApp
        mediaList={mediaData}
        audioNum={getAudioNum}
        startAudio={playAudio}
      />
    </>
  );
};

export default Music;
