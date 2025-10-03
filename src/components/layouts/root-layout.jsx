import NavbarComponent from "./NavbarComponent";
import { Outlet } from "react-router";
import Footer from "./Footer";

export default function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {" "}
      {/* Changed from h-screen to min-h-screen */}
      <NavbarComponent />
      <main className="flex-grow pt-16">
        {" "}
        {/* Added pt-16 for navbar spacing */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
