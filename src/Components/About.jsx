import React, { useState } from "react";
import DarkHp from "../assets/images/dark-homepage.png";
import LightHp from "../assets/images/light-homepage.png";
import { BsInfoSquare } from "react-icons/bs";
import { GrSettingsOption } from "react-icons/gr";
import { GiProcessor } from "react-icons/gi";
import { AppUseContext } from "../context/AppContext";
import { CgWebsite } from "react-icons/cg";
import { CiServer } from "react-icons/ci";
import { MdLineStyle } from "react-icons/md";
import { CiRoute } from "react-icons/ci";
import { GrDeploy } from "react-icons/gr";
import { CiUser } from "react-icons/ci";

const About = () => {
  const { isToggleOn } = AppUseContext();
  const techTabObj = [
    {
      id: "frontend",
      title: "Frontend",
      icon: <CgWebsite />,
      content: (
        <ul>
          <li>
            <b>React JS</b>: Used to build the user interface (UI) of
            FileStream. React allows for creating reusable components, making
            the development process faster and easier to maintain. Its virtual
            DOM ensures efficient updates to the UI, leading to a smooth user
            experience.
          </li>
          <li>
            <b>Framer Motion</b>: Implemented for smooth animations and user
            interactions within FileStream. Framer Motion simplifies the
            creation of complex animations without writing a lot of code,
            enhancing the visual appeal and user experience.
          </li>
        </ul>
      ),
    },
    {
      id: "backend",
      title: "Backend",
      icon: <CiServer />,
      content: (
        <p>
          <b>Supabase</b>: Provides a robust backend-as-a-service (BaaS)
          solution for FileStream. Supabase simplifies backend development by
          offering features like a real-time database, user authentication, and
          storage functionality - all readily available for use in your
          application.
        </p>
      ),
    },
    {
      id: "styling",
      title: "Styling",
      icon: <MdLineStyle />,
      content: (
        <p>
          <b>SCSS</b>: Used to manage the styles of FileStream. SCSS extends the
          functionality of CSS by introducing features like variables and
          mixins. This allows for cleaner, more maintainable, and scalable
          stylesheets, especially for complex applications like FileStream.
        </p>
      ),
    },
    {
      id: "routing",
      title: "Routing",
      icon: <CiRoute />,
      content: (
        <p>
          <b>React Router DOM</b>: Enables seamless navigation within
          FileStream. React Router DOM provides components for defining routes
          and handling navigation transitions, allowing users to easily move
          between different sections of the application.
        </p>
      ),
    },
    {
      id: "deployment",
      title: "Deployment",
      icon: <GrDeploy />,
      content: (
        <p>
          <b>Firebase</b>: Chosen for hosting and deployment of FileStream.
          Firebase offers a scalable and reliable platform, ensuring the
          application is readily accessible and performs well for all users.
          Additionally, Firebase provides features like authentication and
          storage functionalities that can be integrated with FileStream.
        </p>
      ),
    },
  ];

  const [activeTab, setActiveTab] = useState(techTabObj[0].id);

  const handleClick = (id) => {
    setActiveTab(id);
  };
  return (
    <>
      <div className="about-container">
        <div className="about-flex-content">
          <div className="about-content-left">
            <p className="about-sm-title">
              <BsInfoSquare /> About
            </p>
            <h1>FileStream: A Robust File Management Application</h1>
            <p>
              FileStream is a powerful application designed to streamline file
              management and storage for our users. It leverages the secure and
              scalable infrastructure of Supabase to ensure your files are
              always accessible and protected.
            </p>
          </div>
          <div className="about-content-right">
            <img
              src={isToggleOn ? LightHp : DarkHp}
              alt="home-page"
              width="100%"
            />
          </div>
        </div>
        <p className="about-sm-title">
          <GrSettingsOption /> Key Features
        </p>
        <ul>
          <li>
            <b>Effortless Uploads and Storage</b>: Drag-and-drop or browse to
            upload various file types, including images, videos, audio files,
            and documents.
          </li>
          <li>
            <b>Organized Categorization</b>: Categorize your files using four
            pre-defined categories (Images, Videos, Audios, Documents) for easy
            organization and retrieval.
          </li>
          <li>
            <b>Customizable Labels</b>: Enhance organization further by adding
            custom labels to your files. This allows you to create a
            personalized filing system tailored to your specific needs.
          </li>
          <li>
            <b>Visualized Storage Usage</b>: Gain a clear understanding of your
            allocated storage space with a visual representation of your current
            file usage within your account page.
          </li>
          <li>
            <b>Profile Management</b>: Update your profile picture directly
            within the FileStream application, ensuring your account profile
            reflects your current identity.
          </li>
        </ul>
        <p>
          Leveraged Context API for efficient state management across
          application components. Implemented seamless authentication using
          Google and Github through Supabase, a robust backend-as-a-service
          solution. Firebase provided a scalable and reliable platform for
          hosting the application, ensuring optimal performance and
          availability.
        </p>

        <div
          style={{
            paddingTop: "20px",
          }}
        >
          <p className="about-sm-title">
            <GiProcessor /> Technology
          </p>
          <div className="about-tech-container">
            {techTabObj.map((item, ind) => {
              return (
                <div
                  key={item.id}
                  className={`${activeTab === item.id && "active"}`}
                  onClick={() => handleClick(item.id)}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </div>
              );
            })}
          </div>
          {techTabObj.map((item, ind) => (
            <div key={item.id}>{activeTab === item.id && item.content}</div>
          ))}
        </div>

        <div
          style={{
            paddingTop: "20px",
          }}
        >
          <p className="about-sm-title">
            <CiUser /> About Me
          </p>

          <p>
            Hi there, I'm Russell Dsouza! My passion lies in building web
            applications that are both user-friendly and visually appealing.
            During college, I took the initiative to explore web development on
            my own, igniting a fire that led me to further hone my skills
            through a Front-End Development certification course at TryCatch
            Classes. Now, as a web developer at Futuready Media, I'm actively
            involved in crafting engaging and innovative websites, constantly
            striving to push the boundaries of web design. My experience aligns
            well with the technologies used in FileStream, and you can see more
            of my work focused on web development in my portfolio:{" "}
            <b>
              <a
                href="https://russeldsouza.dev/"
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "inherit",
                }}
              >
                Russel Dsouza
              </a>
            </b>
            .
          </p>
        </div>
      </div>
    </>
  );
};

export default About;
