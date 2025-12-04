import { Outlet } from "react-router-dom";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import "./AppLayout.css"; 

export default function AppLayout() {
    return (
        <div className="app-layout">
            <Header />
                <main className="app-main">  {/* <--  Any component that comes through a Route defined as a child will be inserted into the Outlet. */}
                    <Outlet />   {/* <--  The component will appear here according to the Route */}
                </main>
            <Footer />
        </div>
    );
}