import "./App.css";
import { BrowserRouter } from "react-router-dom";
import RoutesComponent from "./Components/RoutesComponent";
import TopNav from "./Components/NavComponent/TopNav";
import "./styles/Main.scss";
import "./styles/LightMode.scss";
import "./styles/responsive.scss";
import { AppUseContext } from "./context/AppContext";

function App() {
  const { isToggleOn } = AppUseContext();
  return (
    <>
      <BrowserRouter>
        <TopNav />
        <RoutesComponent />
        <footer className={`${isToggleOn && "footer-light"}`}>
          <span>Developed by Russel Dsouza | </span>
          <a href="https://russeldsouza.dev/" target="_blank">
            Portfolio
          </a>
        </footer>
      </BrowserRouter>
    </>
  );
}

export default App;
