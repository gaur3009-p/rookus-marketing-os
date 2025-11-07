import Dashboard from './pages/Dashboard';
import Studio from './pages/Studio';
import Campaigns from './pages/Campaigns';
import Library from './pages/Library';
import Analytics from './pages/Analytics';
import BrandSetup from './pages/BrandSetup';
import CampaignBuilder from './pages/CampaignBuilder';
import Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Studio": Studio,
    "Campaigns": Campaigns,
    "Library": Library,
    "Analytics": Analytics,
    "BrandSetup": BrandSetup,
    "CampaignBuilder": CampaignBuilder,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: Layout,
};