import "./style.css";
import { renderLayout } from "./components/layout";
import { initNavigation } from "./components/navigation";
import { initListingDetailsPage } from "./pages/listing-details";

renderLayout();
initNavigation();
initListingDetailsPage();
