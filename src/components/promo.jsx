import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import PromoForm from "./promoForm";
import http from "../services/httpService";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Promo = (props) => {
  const URL = process.env.REACT_APP_API_URL;
  const [show, setShow] = useState(false);
  const [promos, setPromos] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  async function getPromotions() {
    let url = `${URL}/api/admin/promos`;
    let token = localStorage.getItem("token");
    if (!token || token === "") return;

    let headers = { "x-auth-token": token };

    let response = await http.get(url, {}, headers);

    if (response.status && response.status === 200) {
      setPromos(response.data);
    }
  }

  async function disablePromotion(id) {
    let url = `${URL}/api/admin/promos/${id}/disable`;
    let token = localStorage.getItem("token");
    if (!token || token === "") return;

    let headers = { "x-auth-token": token };

    let response = await http.put(url, headers);

    if (response.status && response.status === 200) {
      toast.success(response.data, { position: toast.POSITION.TOP_CENTER });
      getPromotions();
    }
  }

  useEffect(() => {
    getPromotions();
  }, []);

  return (
    <React.Fragment>
      <PromoForm show={show} handleClose={handleClose} />
      <div id="promo">
        <header>
          <p>
            Promociones -{" "}
            <FontAwesomeIcon
              style={{ cursor: "pointer" }}
              onClick={() => getPromotions()}
              icon="fa-solid fa-arrows-rotate"
            />
          </p>
        </header>
        {!promos ? (
          <Spinner animation="grow" className="m-3" />
        ) : (
          <Table striped bordered hover responsive variant="light">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Codigo</th>
                <th>Descuento</th>
                <th>Fecha de inicio</th>
                <th>Fecha final</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {promos.length < 1 ? (
                <tr>
                  <td>No hay promociones disponibles</td>
                </tr>
              ) : (
                promos.map((promo, idx) => (
                  <tr id={promo._id} key={promo._id}>
                    <td>{idx + 1}</td>
                    <td>{promo.name}</td>
                    <td>{promo.code}</td>
                    <td>{promo.discount}%</td>
                    <td>{promo.start}</td>
                    <td>{promo.deadline}</td>
                    <td>{promo.enabled ? "Activa" : "Inactiva"}</td>
                    <td>
                      <Button
                        variant="primary"
                        onClick={() => disablePromotion(promo._id)}
                        disabled={promo.enabled ? false : true}
                      >
                        Deshabilitar
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}
        <div>
          <Button variant="primary" onClick={handleShow}>
            Crear nueva promocion
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Promo;
