import React from "react";
import { Route, Routes } from "react-router-dom";
import ImgComponent from "./ImgComponent/ImagePage";
import Home from "./HomeComponent/Home";
import VideoComponent from "./VideoComponent/VideoPage";
import Music from "./MusicComponsnt/Music";
import LabelComponent from "./LabelComponent";
import LabelData from "./LabelData";
import Docs from "./documents/Docs";
import { AppUseContext } from "../context/AppContext";
import UserAccount from "./UserAccount";
import About from "./About";

const RoutesComponent = () => {
  const { checkSideMenu, isToggleOn } = AppUseContext();
  return (
    <>
      <div
        className={`container ${checkSideMenu && "side-menu-active"} ${
          isToggleOn ? "light-container" : null
        }`}
      >
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/user-account" element={<UserAccount />} />
          <Route exact path="/image" element={<ImgComponent />} />
          <Route exact path="/video" element={<VideoComponent />} />
          <Route exact path="/audio" element={<Music />} />
          <Route exact path="/docs" element={<Docs />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/label" element={<LabelComponent />} />
          <Route exact path="/label/:labelid" element={<LabelData />} />
        </Routes>
      </div>
    </>
  );
};

export default RoutesComponent;
