import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { store } from "../app/store";
import { setAdmin } from "../features/userSlice";
import jwt_decode from "jwt-decode";
import http from "../services/httpService";
import { ToastContainer } from "react-toastify";

function Login() {
  const [cedula, setCedula] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(null);
  const navigate = useNavigate();

  async function login() {
    setRedirect(true);
    let data = {
      cedula: cedula,
      password: password,
    };

    let url = `${process.env.REACT_APP_API_URL}/api/admin/login`;

    const response = await http.post(url, data);

    if (response && response.status && response.status === 200) {
      toast.success(response.data, {
        position: toast.POSITION.TOP_CENTER,
      });

      let token = response.headers["x-auth-token"];
      let decoded = jwt_decode(token);
      store.dispatch(setAdmin(decoded));
      localStorage.setItem("token", response.headers["x-auth-token"]);

      setTimeout(() => {
        setRedirect(false);
        navigate("/");
      }, 2000);
      return;
    }

    setRedirect(false);
    return;
  }

  return (
    <div id="login">
      <ToastContainer hideProgressBar />
      <form>
        <p>Iniciar seccion</p>
        <FloatingLabel
          controlId="floatingInput"
          label="Cedula"
          className="mb-3"
        >
          <Form.Control
            type="email"
            placeholder="Cedula"
            value={cedula}
            onChange={(e) => setCedula(e.currentTarget.value)}
          />
        </FloatingLabel>
        <FloatingLabel controlId="floatingPassword" label="Contraseña">
          <Form.Control
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
        </FloatingLabel>
        <br />
        <Button variant="primary" size="sm" onClick={login}>
          Iniciar seccion
        </Button>
        <br />
        <br />
        {redirect ? <Spinner animation="border" variant="light" /> : null}
      </form>
    </div>
  );
}

export default Login;
