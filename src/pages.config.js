import Dashboard from './pages/Dashboard';
import Studio from './pages/Studio';
import Campaigns from './pages/Campaigns';
import Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Studio": Studio,
    "Campaigns": Campaigns,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: Layout,
};