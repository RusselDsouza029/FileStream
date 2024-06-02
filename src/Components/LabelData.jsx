import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppUseContext } from "../context/AppContext";
import Fancybox from "./ImgComponent/Fancybox";
import { AiOutlineClose } from "react-icons/ai";
import VideoPopup from "./VideoPopup";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { CgFileDocument } from "react-icons/cg";
import Tooltip from "./Tooltip";
import { FiMusic } from "react-icons/fi";
import PlayerApp from "./MusicComponsnt/PlayerApp";

const LabelData = () => {
  const { labelid } = useParams();
  const { userEmail, supabase, userStatus } = AppUseContext();
  const [labelData, setLabelData] = useState([]);
  const [videoState, setVideoState] = useState(false);
  const navigate = useNavigate();
  const [videoName, setVideoName] = useState();
  const [docState, setDocState] = useState(false);
  const [docName, setDocName] = useState("");
  const [audioName, setAudioName] = useState("");
  const [playAudio, setPlayAudio] = useState(false);

  async function fetchLabelData() {
    const { data, error } = await supabase
      .from("labelsdetails")
      .select("*")
      .eq("email", userEmail)
      .eq("labelname", labelid);

    if (error) {
      console.log(error);
    } else {
      setLabelData(data);
    }
  }

  useEffect(() => {
    fetchLabelData();
    // eslint-disable-next-line
  }, [userStatus]);

  const handleVideoState = () => {
    setVideoState(!videoState);
  };

  const handleDocPopup = () => {
    setDocState(!docState);
  };

  const docs = [
    {
      uri: `https://xcklppdgsllqvozdzvaz.supabase.co/storage/v1/object/public/users/${userEmail}/docs/${docName}`,
    }, // Remote file
  ];

  async function handleDeleteLabelItem({ itemName }) {
    const { error } = await supabase
      .from("labelsdetails")
      .delete()
      .eq("email", userEmail)
      .eq("labelname", labelid)
      .eq("fileName", itemName);

    if (error) {
      console.error("Error while deleting file", error);
    } else {
      fetchLabelData();
    }
  }

  useEffect(() => {
    if (!userStatus) {
      navigate("/");
    }
    // eslint-disable-next-line
  }, [userStatus]);

  return (
    <>
      <div className="label-name">
        <div className="label-navigate" onClick={() => navigate(-1)}>
          <AiOutlineClose />
          {labelid}
        </div>
      </div>
      <div className="label-content-component">
        {labelData.map((data, ind) => {
          return (
            <div key={ind} className="label-content-container">
              <div className="delete-label-media">
                <Tooltip text="Delete" position="top">
                  <button
                    onClick={() => {
                      handleDeleteLabelItem({ itemName: data.fileName });
                    }}
                  >
                    <AiOutlineClose />
                  </button>
                </Tooltip>
              </div>
              {data.folderName === "images" ? (
                <div className="img-folder-container">
                  <Fancybox
                    options={{
                      Carousel: {
                        infinite: false,
                      },
                    }}
                  >
                    <a
                      data-fancybox="gallery"
                      href={`https://xcklppdgsllqvozdzvaz.supabase.co/storage/v1/object/public/users/${userEmail}/images/${data.fileName}`}
                      onClick={(e) => e.preventDefault()}
                    >
                      <img
                        src={`https://xcklppdgsllqvozdzvaz.supabase.co/storage/v1/object/public/users/${userEmail}/images/${data.fileName}`}
                        width="100%"
                        alt="data.fileName"
                      />
                    </a>
                  </Fancybox>
                </div>
              ) : data.folderName === "videos" ? (
                <video
                  width="100%"
                  onClick={() => {
                    handleVideoState();
                    setVideoName(data.fileName);
                  }}
                >
                  <source
                    src={`https://xcklppdgsllqvozdzvaz.supabase.co/storage/v1/object/public/users/${userEmail}/videos/${data.fileName}`}
                    type="video/mp4"
                  />
                </video>
              ) : data.folderName === "audio" ? (
                <div
                  className="label-audio-content"
                  onClick={() => {
                    setAudioName(data.fileName);
                    setPlayAudio(true);
                  }}
                >
                  <div className="label-audio-icon">
                    <FiMusic />
                  </div>
                  <div className="label-audio-text">{data.fileName}</div>
                  {/* <audio controls>
                    <source src="" type="audio/mpeg" />
                  </audio> */}
                </div>
              ) : data.folderName === "docs" ? (
                <div
                  onClick={() => {
                    handleDocPopup();
                    setDocName(data.fileName);
                  }}
                  className="label-doc-content"
                >
                  <div className="label-doc-icon">
                    <CgFileDocument />
                  </div>
                  <div className="label-doc-text">{data.fileName}</div>
                </div>
              ) : (
                <p>{data.fileName}</p>
              )}
            </div>
          );
        })}
        <VideoPopup
          videoState={videoState}
          videoStateFun={handleVideoState}
          videoMedia={videoName}
          handleVideoMedia={false}
        />
      </div>
      {docState ? (
        <div className="doc-viewer-popup">
          <div className="doc-features">
            {/* <MediaFeatures
                  showOnHover={false}
                  folderName="docs"
                  mediaName={docName}
                >
                </MediaFeatures> */}
            <button onClick={handleDocPopup}>
              <AiOutlineClose />
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

      <PlayerApp
        mediaList={audioName}
        audioNum={0}
        startAudio={playAudio}
        fromLabel={true}
      />
    </>
  );
};

export default LabelData;
