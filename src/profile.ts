import "./style.css";
import { renderLayout } from "./components/layout";
import { initNavigation } from "./components/navigation";
import { initProfilePage } from "./pages/profile";

renderLayout();
initNavigation();
initProfilePage();
