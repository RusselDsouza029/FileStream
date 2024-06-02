import React, { useState, useRef, useEffect } from "react";

const AudioPlayer = ({ musicList, mailId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % musicList.length);
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    setCurrentTrackIndex((prevIndex) =>
      prevIndex === 0 ? musicList.length - 1 : prevIndex - 1
    );
    setIsPlaying(true);
  };

  const updateTime = () => {
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration);
  };

  useEffect(() => {
    // Stop the currently playing audio when a new audio starts
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    setCurrentTime(0);
    setDuration(0);
  }, [currentTrackIndex]);

  return (
    <div>
      <audio
        ref={audioRef}
        src={`https://xcklppdgsllqvozdzvaz.supabase.co/storage/v1/object/public/users/${mailId}/music/${musicList[currentTrackIndex].name}`}
        onEnded={handleNext}
        onTimeUpdate={updateTime}
      />

      <div>
        <button onClick={handlePrevious}>Previous</button>
        <button onClick={handlePlayPause}>
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button onClick={handleNext}>Next</button>
      </div>

      <div>
        <p>Current Time: {currentTime.toFixed(2)}</p>
        <p>Total Duration: {duration.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default AudioPlayer;
