import "./style.css";
import { renderLayout } from "./components/layout/layout";
import { initNavigation } from "./components/layout/navigation";
import { initProfilePage } from "./pages/profile";

renderLayout();
initNavigation();
initProfilePage();
