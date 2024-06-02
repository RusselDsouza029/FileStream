import React, { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import VideoPlayer from "./VideoComponent/VideoPlayer";
import { AppUseContext } from "../context/AppContext";
import { IoMdClose, IoIosArrowBack } from "react-icons/io";
import { CiStreamOn } from "react-icons/ci";

const VideoPopup = ({
  videoState,
  videoStateFun,
  videoMedia,
  allVideoMedia,
  handleVideoMedia = true,
}) => {
  const { userEmail } = AppUseContext();
  const [videoSrc, setVideoSrc] = useState(null);
  const [sideVideos, setSideVideos] = useState(false);

  useEffect(() => {
    if (videoMedia) {
      setVideoSrc(videoMedia);
    }
  }, [videoMedia]);

  useEffect(() => {
    if (videoState) {
      setVideoSrc(videoMedia);
    }
  }, [videoState, videoMedia]);

  const handleChangeVideoSrc = useCallback((data) => {
    setVideoSrc(data);
  }, []);

  const videoVariants = {
    open: { top: "0%", opacity: 1 },
    close: { top: "100%", opacity: 0 },
  };

  return (
    <>
      <AnimatePresence>
        {videoState && (
          <motion.div
            className="video-content-container"
            initial="close"
            animate="open"
            exit="close"
            transition={{
              duration: 0.4,
              // ease: "easeInOut",
            }}
            // style={{
            //   display: videoState ? "block" : "none",
            //   transition: "all 0.5s ease-in-out",
            // }}
            variants={videoVariants}
          >
            <div className="video-content">
              <div className="video-player-container vid-max">
                <button
                  onClick={videoStateFun}
                  style={{
                    marginBottom: "20px",
                  }}
                >
                  <IoMdClose />
                </button>
                {videoSrc ? (
                  <VideoPlayer
                    videoSrc={`https://xcklppdgsllqvozdzvaz.supabase.co/storage/v1/object/public/users/${userEmail}/videos/${videoSrc}`}
                  />
                ) : null}
              </div>
            </div>
            {handleVideoMedia ? (
              <motion.div
                className="all-videos-container vid-max"
                initial={{
                  right: "-15%",
                }}
                animate={{
                  right: sideVideos ? "0%" : "-15%",
                  transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                  },
                }}
              >
                <button onClick={() => setSideVideos(!sideVideos)}>
                  <motion.span
                    initial={{
                      transform: "rotate(0)",
                    }}
                    animate={{
                      transform: sideVideos ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "all 0.5s ease-in-out",
                    }}
                  >
                    <IoIosArrowBack />
                  </motion.span>
                </button>
                {allVideoMedia.map((data, int) => (
                  <div key={data.name} className="media-items">
                    <video onClick={() => handleChangeVideoSrc(data.name)}>
                      <source
                        src={`https://xcklppdgsllqvozdzvaz.supabase.co/storage/v1/object/public/users/${userEmail}/videos/${data.name}`}
                      />
                    </video>
                    {videoSrc === data.name ? (
                      <div className="stream-on">
                        <CiStreamOn />
                      </div>
                    ) : null}
                  </div>
                ))}
              </motion.div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VideoPopup;
