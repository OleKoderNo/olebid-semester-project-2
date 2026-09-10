import "./style.css";
import { renderLayout } from "./components/layout/layout";
import { initNavigation } from "./components/layout/navigation";
import { initBrowsePage } from "./pages/browse";

renderLayout();
initNavigation();
initBrowsePage();
