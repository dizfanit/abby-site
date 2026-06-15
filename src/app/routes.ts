import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { LandingPage } from "./components/LandingPage";
import { RealEstateCatalog } from "./components/RealEstateCatalog";
import { PropertyDetail } from "./components/PropertyDetail";
import { ServicesCatalog } from "./components/ServicesCatalog";
import { ContractorProfile } from "./components/ContractorProfile";
import { EstimateCalculator } from "./components/EstimateCalculator";
import { DealWizard } from "./components/DealWizard";
import { ProjectTimeline } from "./components/ProjectTimeline";
import { ArbitrationScreen } from "./components/ArbitrationScreen";
import { ContractorDashboard } from "./components/ContractorDashboard";
import { ContentHub } from "./components/ContentHub";
import { ProfilePage } from "./components/ProfilePage";
import { MarketPage } from "./components/MarketPage";
import { JobsPage } from "./components/JobsPage";
import { AuthPage } from "./components/AuthPage";
import { CreateListingPage } from "./components/CreateListingPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: LandingPage },
      { path: "realestate", Component: RealEstateCatalog },
      { path: "realestate/:id", Component: PropertyDetail },
      { path: "services", Component: ServicesCatalog },
      { path: "contractor/:id", Component: ContractorProfile },
      { path: "calculator", Component: EstimateCalculator },
      { path: "deal", Component: DealWizard },
      { path: "timeline", Component: ProjectTimeline },
      { path: "arbitration", Component: ArbitrationScreen },
      { path: "dashboard", Component: ContractorDashboard },
      { path: "hub", Component: ContentHub },
      { path: "profile", Component: ProfilePage },
      { path: "market", Component: MarketPage },
      { path: "jobs", Component: JobsPage },
      { path: "post", Component: CreateListingPage },
    ],
  },
  // Auth outside Layout (no header/footer)
  { path: "/auth", Component: AuthPage },
]);