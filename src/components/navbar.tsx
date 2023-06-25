import "bootstrap/dist/css/bootstrap.min.css";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import InfoModal from "~/components/info-modal";

interface CustomLinkProps {
  label: string;
  path?: string;
  query?: string;
  event?: unknown;
}

const CustomLink: React.FC<CustomLinkProps> = ({
  label,
  path,
  query,
  event,
}) => {
  const queryParams = new URLSearchParams(query).toString();
  const handleClick = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Replace the current history entry with the new page
    window.history.replaceState({}, "", path);
    event();
  };

  return event ? (
    <Link href="/" className="nav-link no-underline" onClick={handleClick}>
      {label}
    </Link>
  ) : (
    <Link
      href={path ? `${path}?${queryParams}` : ""}
      className="nav-link no-underline"
    >
      {label}
    </Link>
  );
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

  const userId =
    session && session.user && session.user.id ? session.user.id : "404";
  const user = session && session.user ? session.user : null;

  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">AirCamp</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ml-auto">
              <CustomLink label="Home" path="/campgrounds" />
              <CustomLink label="About" path="#about" event={openModal} />
              {session ? (
                <>
                  <CustomLink
                    label="Profile"
                    path={`/profile/${userId}}`}
                    query={JSON.stringify(user)}
                  />
                  <CustomLink label="Logout" event={() => void signOut()} />
                </>
              ) : (
                <>
                  <CustomLink label="Login" event={() => void signIn()} />
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
