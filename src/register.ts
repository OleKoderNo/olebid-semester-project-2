import "./style.css";
import { renderLayout } from "./components/layout/layout";
import { initNavigation } from "./components/layout/navigation";
import { initRegisterPage } from "./pages/register";

renderLayout();
initNavigation();
initRegisterPage();
