import { Link } from "react-router-dom";
import { CiImageOn, CiMusicNote1 } from "react-icons/ci";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";
import "../../styles/Home.scss";

const Home = () => {
  const foldersData = [
    {
      fName: "Images",
      fPath: "/image",
      fIcon: <CiImageOn />,
    },
    {
      fName: "Videos",
      fPath: "/video",
      fIcon: <MdOutlineVideoLibrary />,
    },
    {
      fName: "audio",
      fPath: "/audio",
      fIcon: <CiMusicNote1 />,
    },
    {
      fName: "Documents",
      fPath: "/docs",
      fIcon: <IoDocumentTextOutline />,
    },
  ];

  return (
    <>
      <div className="folder-container">
        {foldersData.map((content) => {
          return (
            <Link
              className="folder-content"
              to={content.fPath}
              key={content.fName}
            >
              {content.fIcon}
              <span>{content.fName}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default Home;
