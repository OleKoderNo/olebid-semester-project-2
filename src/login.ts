import "./style.css";
import { renderLayout } from "./components/layout";
import { initNavigation } from "./components/navigation";
import { initLoginPage } from "./pages/login";

renderLayout();
initNavigation();
initLoginPage();
