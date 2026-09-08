import "./style.css";
import { renderLayout } from "./components/layout";
import { initNavigation } from "./components/navigation";
import { initBrowsePage } from "./pages/browse";

renderLayout();
initNavigation();
initBrowsePage();
