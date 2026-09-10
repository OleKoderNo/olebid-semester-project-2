import "./style.css";
import { renderLayout } from "./components/layout/layout";
import { initNavigation } from "./components/layout/navigation";
import { initLoginPage } from "./pages/login";

renderLayout();
initNavigation();
initLoginPage();
