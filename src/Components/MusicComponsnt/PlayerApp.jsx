import { useEffect, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import { AppUseContext } from "../../context/AppContext";
import "react-h5-audio-player/lib/styles.css";
import { motion } from "framer-motion";

const PlayerApp = ({ mediaList, audioNum, startAudio, fromLabel = false }) => {
  const { userEmail } = AppUseContext();
  const [currentTrack, setTrackIndex] = useState(audioNum);

  useEffect(() => {
    setTrackIndex(audioNum);
  }, [audioNum]);

  const handleClickNext = () => {
    setTrackIndex((currentTrack) =>
      currentTrack < mediaList.length - 1 ? currentTrack + 1 : 0
    );
  };

  const handleEnd = () => {
    setTrackIndex((currentTrack) =>
      currentTrack < mediaList.length - 1 ? currentTrack + 1 : 0
    );
  };

  const handlePrev = () => {
    setTrackIndex((currentTrack) =>
      currentTrack > 0 ? currentTrack - 1 : mediaList.length - 1
    );
  };

  const handleError = (error) => {
    console.error("Error:", error);
  };

  const audioVariants = {
    open: { y: "0", opacity: 1 },
    close: { y: "100%", opacity: 0 },
  };


  return (
    <>
      {startAudio ? (
        <motion.div
          className="audio-player-component"
          initial="close"
          animate="open"
          exit="close"
          variants={audioVariants}
        >
          <AudioPlayer
            autoPlay={startAudio}
            volume="1"
            src={`https://xcklppdgsllqvozdzvaz.supabase.co/storage/v1/object/public/users/${userEmail}/audio/${
              fromLabel ? mediaList : mediaList[currentTrack]?.name
            }`}
            showSkipControls
            onClickNext={handleClickNext}
            onEnded={handleEnd}
            onClickPrevious={handlePrev}
            // playing={isPlaying}
            onError={handleError}
          />
        </motion.div>
      ) : null}
    </>
  );
};

export default PlayerApp;
