import "bootstrap/dist/css/bootstrap.min.css";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import InfoModal from "~/components/info-modal";

enum Page {
  Home = "Home",
  About = "About",
  Profile = "Profile",
  Login = "Login",
  Logout = "Logout",
}

interface CustomLinkProps {
  label: string;
  path?: string;
  query?: Record<string, string>;
  event?: () => void;
}

const CustomLink: React.FC<CustomLinkProps> = ({
  label,
  path,
  query,
  event,
}) => {
  const queryParams = new URLSearchParams(query).toString();
  const loginLogout = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Replace the current history entry with the new page
    window.history.replaceState({}, "", path);
    if (event) {
      // Trigger event if exists
      event();
    }
  };

  switch (label) {
    case Page.Login:
    case Page.Logout:
      return (
        <Link href="#" className="nav-link no-underline" onClick={loginLogout}>
          {label}
        </Link>
      );
    case Page.Home:
    case Page.Profile:
      return (
        <Link
          href={path ? `${path}?${queryParams}` : ""}
          className="nav-link no-underline"
        >
          {label}
        </Link>
      );
    default:
      // Open modal
      return (
        <Link href="#" className="nav-link no-underline" onClick={event}>
          {label}
        </Link>
      );
  }
};

const CustomNavbar = () => {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const sessionAndUserExist = session && session.user;
  const user = sessionAndUserExist ? session.user : null;
  const userId = user?.id ?? "404";
  const userQuery: Record<string, string> = {
    id: user?.id ?? "",
    name: user?.name ?? "",
    email: user?.email ?? "",
    image: user?.image ?? "",
  };

  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">AirCamp</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ml-auto">
              <CustomLink label={Page.Home} path="/campgrounds" />
              <CustomLink label={Page.About} path="#about" event={openModal} />
              {session ? (
                <>
                  <CustomLink
                    label={Page.Profile}
                    path={`/profile/${userId}}`}
                    query={userQuery}
                  />
                  <CustomLink
                    label={Page.Logout}
                    event={() => void signOut()}
                  />
                </>
              ) : (
                <>
                  <CustomLink label={Page.Login} event={() => void signIn()} />
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <InfoModal isOpen={isModalOpen} closeModal={closeModal} />
    </>
  );
};

export default CustomNavbar;
