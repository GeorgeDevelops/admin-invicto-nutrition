import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { store } from "../app/store";
import { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";

function NavBar() {
  const [admin, setAdmin] = useState(store.getState().user.value);

  store.subscribe(() => {
    setAdmin(store.getState().user.value);
  });

  function logout() {
    localStorage.removeItem("token");
    window.location = "/login";
  }

  useEffect(() => {
    let token = localStorage.getItem("token");
    let decoded = jwtDecode(token);
    setAdmin(decoded);
  }, []);

  return (
    <div id="navbar">
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>
            <Link to={"/inicio"} id="title">
              Invicto Nutrition Admin
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto m-auto">
              <Link to={"/inicio"}>Inicio</Link>&nbsp;&nbsp;&nbsp;
              <Link to={"/productos"}>Productos</Link>&nbsp;&nbsp;&nbsp;
              <Link to={"/pedidos"}>Pedidos</Link>&nbsp;&nbsp;&nbsp;
              <Link to={"/promociones"}>Promociones</Link>&nbsp;&nbsp;&nbsp;
              <Link to={"/correo"}>Correo</Link>
            </Nav>
            <Nav>
              <Nav.Link>
                <FontAwesomeIcon
                  onClick={() => (admin ? null : (window.location = "/login"))}
                  icon="fa-solid fa-user"
                />
                &nbsp;
                {admin.firstName && `${admin.firstName} ${admin.lastName}`}
              </Nav.Link>
              <Nav.Link onClick={!admin ? null : logout}>
                <FontAwesomeIcon icon="fa-solid fa-right-from-bracket" />
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default NavBar;
