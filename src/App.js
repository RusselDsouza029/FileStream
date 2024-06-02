import "./App.css";
import { BrowserRouter } from "react-router-dom";
import RoutesComponent from "./Components/RoutesComponent";
import TopNav from "./Components/NavComponent/TopNav";
import "./styles/Main.scss";
import "./styles/LightMode.scss";
import "./styles/responsive.scss";

function App() {
  return (
    <>
      <BrowserRouter>
        <TopNav />
        <RoutesComponent />
      </BrowserRouter>
    </>
  );
}

export default App;
