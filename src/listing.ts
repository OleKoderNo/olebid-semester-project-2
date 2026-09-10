import "./style.css";
import { renderLayout } from "./components/layout/layout";
import { initNavigation } from "./components/layout/navigation";
import { initListingDetailsPage } from "./pages/listing-details";

renderLayout();
initNavigation();
initListingDetailsPage();
