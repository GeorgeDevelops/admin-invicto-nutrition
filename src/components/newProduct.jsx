import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import { useState, useEffect, useRef } from "react";
import { storage } from "./../firebase";
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { v4 } from "uuid";
import ProgressBar from "react-bootstrap/ProgressBar";
import http from "../services/httpService";
import { toast } from "react-toastify";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";

function NewProduct() {
  const inputRef = useRef();
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(null);

  const [files, setFiles] = useState([null]);

  const [brand, setBrand] = useState({});
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState({});
  const [weights, setWeights] = useState([]);
  const [weight, setWeight] = useState("");
  const [measure, setMeasure] = useState("");
  const [price, setPrice] = useState("");
  const [flavor, setFlavor] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [description, setDescription] = useState("");
  const [showDelete, setShowDelete] = useState(null);
  const [images, setImages] = useState([]);
  const [deletingProduct, setDeletingProduct] = useState(false);
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  function handleFileInputChange({ currentTarget: input }) {
    setFiles(input.files);
  }

  function uploadFiles() {
    setShowProgress(true);
    let URL_Array = [];

    return new Promise((resolve, reject) => {
      for (let i = 0; i < files.length; i++) {
        const imageRef = ref(
          storage,
          `products/${files[i].name.split(".")[0]}-${v4()}`
        );
        let uploadTask = uploadBytesResumable(imageRef, files[i]);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            console.log("Upload is " + progress + "% done");
            setProgress(progress);
            if (progress >= 100) setShowProgress(true);
          },
          (error) => {
            console.log(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              URL_Array.push({ url: downloadURL });
              if (URL_Array.length === files.length) return resolve(URL_Array);
            });
          }
        );
      }
    });
  }

  function deleteImagesFromStorage(arr) {
    return new Promise(async (resolve, reject) => {
      for (let i = 0; i < arr.length; i++) {
        let imageRef = ref(storage, arr[i].url);
        await deleteObject(imageRef)
          .then(() => {
            toast.success("Imagen eliminada para evitar images duplicadas", {
              position: toast.POSITION.TOP_CENTER,
            });
          })
          .catch((error) => {
            toast.error(
              "Imagenes no eliminadas esto puede resultar en imagenes duplicadas",
              {
                position: toast.POSITION.TOP_CENTER,
              }
            );
          });
        console.log(`${i} = ${arr.length - 1}`);
        if (i === arr.length - 1) resolve(true);
      }
    });
  }

  async function postNewProduct() {
    const images_url_array = await uploadFiles();

    if (!productName || productName === "") {
      toast.warn("Nombre del producto es obligatorio.", {
        position: toast.POSITION.TOP_CENTER,
      });
      return deleteImagesFromStorage(images_url_array);
    }

    if (!description || description === "") {
      toast.warn("Descripcion es obligatoria.", {
        position: toast.POSITION.TOP_CENTER,
      });
      return deleteImagesFromStorage(images_url_array);
    }

    if (!weights || weights.length < 1) {
      toast.warn("Pesos es obligatorio.", {
        position: toast.POSITION.TOP_CENTER,
      });
      return deleteImagesFromStorage(images_url_array);
    }

    if (!brand || Object.keys(brand).length < 2) {
      toast.warn("Marca es obligatoria.", {
        position: toast.POSITION.TOP_CENTER,
      });
      return deleteImagesFromStorage(images_url_array);
    }

    if (!category || Object.keys(category).length < 2) {
      toast.warn("Categoria es obligatoria.", {
        position: toast.POSITION.TOP_CENTER,
      });
      return deleteImagesFromStorage(images_url_array);
    }

    if (!images_url_array || Object.keys(images_url_array).length < 1) {
      toast.warn("Imagenes son obligatorias.", {
        position: toast.POSITION.TOP_CENTER,
      });
      return deleteImagesFromStorage(images_url_array);
    }

    let product = {
      name: productName,
      weight: weights,
      brand,
      images: images_url_array,
      category,
      description,
    };

    let AUTH_TOKEN = localStorage.getItem("token");
    let headers = { headers: { "x-auth-token": AUTH_TOKEN } };

    let url = `${process.env.REACT_APP_API_URL}/api/products/new`;
    let response = await http.post(url, product, headers);

    if (response.status === 200) {
      setProductName("");
      setWeights([]);
      setDescription("");

      return toast.success(response.data, {
        position: toast.POSITION.TOP_CENTER,
      });
    }

    return deleteImagesFromStorage(images_url_array);
  }

  function handleInputChange({ currentTarget: input }) {
    if (input.name === "productName") return setProductName(input.value);
    if (input.name === "weight") return setWeight(input.value);
    if (input.name === "measure") return setMeasure(input.value);
    if (input.name === "price") return setPrice(Number(input.value));
    if (input.name === "flavor") return setFlavor(input.value);
    if (input.name === "quantity") return setQuantity(Number(input.value));
    if (input.name === "description") return setDescription(input.value);
    if (input.name === "brand") return console.log(input);
  }

  function addWeight() {
    setWeights([
      ...weights,
      { id: weights.length + 1, weight, measure, flavor, quantity, price },
    ]);
    setWeight("");
    setMeasure({});
    setFlavor("");
    setQuantity("");
    setPrice("");
  }

  async function deleteProduct() {
    let AUTH_TOKEN = localStorage.getItem("token");
    let headers = { headers: { "x-auth-token": AUTH_TOKEN } };

    setDeletingProduct(true);
    let id = params.id;
    let url = process.env.REACT_APP_API_URL;
    let response = await http.delete(
      `${url}/api/products/delete/${id}`,
      headers
    );

    if (response.status && response.status === 200) {
      let imagesDeleted = await deleteImagesFromStorage(images);

      if (imagesDeleted) {
        toast.success(response.data, {
          position: toast.POSITION.TOP_CENTER,
        });
        setDeletingProduct(false);

        return navigate("/productos");
      }
    }
  }

  async function getProduct() {
    setShowDelete(true);
    let url = process.env.REACT_APP_API_URL;
    let id = params.id;
    let { data } = await http.get(`${url}/api/products/${id}`);
    setProductName(data.name);
    setDescription(data.description);
    setWeights(data.weight);
    setImages(data.images);
    setBrand(data.brand.name);
    setCategory(data.category.name);
  }

  useEffect(() => {
    setTimeout(() => {
      setShowProgress(null);
    }, 2000);
  }, [progress]);

  useEffect(() => {
    let loc = location.pathname.split("/")[3];
    if (loc === "editar") getProduct();
  }, [location, params]);

  let brands = [
    { _id: 4, name: "MuscleTech" },
    { _id: 5, name: "Rule 1 Proteins" },
    { _id: 6, name: "Dymatize" },
    { _id: 7, name: "Optimum Nutrition" },
    { _id: 8, name: "Cellucor" },
    { _id: 9, name: "Body Fortress" },
    { _id: 10, name: "Muscle Pharm" },
    { _id: 11, name: "Patriot Nutrition" },
  ];

  function handleBrandAndCategoryChange({ currentTarget: input }) {
    if (input.name === "brand") {
      for (let i = 0; i < input.children.length; i++) {
        if (input.children[i].value === input.value)
          setBrand({
            id: Number(input.value),
            name: input.children[i].innerText,
          });
      }
    }
    if (input.name === "category") {
      for (let i = 0; i < input.children.length; i++) {
        if (input.children[i].value === input.value)
          setCategory({
            id: Number(input.value),
            name: input.children[i].innerText,
          });
      }
    }
  }

  let categories = [
    { _id: 1, name: "Accesorios" },
    { _id: 2, name: "Aminoacidos" },
    { _id: 3, name: "Pre-Workout" },
    { _id: 12, name: "Aumento de peso" },
    { _id: 13, name: "Aumento Masa Muscular" },
    { _id: 14, name: "perdida de peso" },
    { _id: 15, name: "Vitaminas & Suplementos" },
    { _id: 16, name: "Combos" },
  ];

  let measures = [
    { _id: 17, name: "Libras" },
    { _id: 18, name: "Onzas" },
    { _id: 19, name: "Servidas" },
  ];

  let Flavors = [
    { _id: 20, name: "Chocolate" },
    { _id: 21, name: "Vainilla" },
    { _id: 22, name: "Cookie" },
  ];

  return (
    <div id="product-details">
      <h2>Nuevo producto</h2>&nbsp;
      <Form>
        <Row className="mb-2">
          <Form.Group as={Col} controlId="formFile" className="mb-3">
            <Form.Label>Seleccionar images de exhibicion</Form.Label>
            <Form.Control
              type="file"
              ref={inputRef}
              onChange={(e) => handleFileInputChange(e)}
              accept="image/png, image/jpeg"
              multiple
              required
            />

            <br />
            {showProgress ? (
              <ProgressBar striped now={progress} label={`${progress}%`} />
            ) : null}
          </Form.Group>

          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Marca</Form.Label>
            <Form.Select
              name={"brand"}
              onChange={(e) => handleBrandAndCategoryChange(e)}
              required
            >
              <option>Seleccionar Marca</option>
              {brands.length > 0
                ? brands.map((c) => (
                    <option id={c._id} key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))
                : null}
            </Form.Select>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Nombre y modelo del producto</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre y modelo del producto"
              value={productName}
              name={"productName"}
              required
              onChange={(e) => handleInputChange(e)}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridCategory">
            <Form.Label>Categoria</Form.Label>
            <Form.Select
              name={"category"}
              required
              onChange={(e) => handleBrandAndCategoryChange(e)}
            >
              <option>Seleccionar Categoria</option>
              {categories.length > 0
                ? categories.map((b) => (
                    <option id={b._id} key={b._id} value={b._id}>
                      {b.name}
                    </option>
                  ))
                : null}
            </Form.Select>
          </Form.Group>
        </Row>

        <div className="peso">
          <div>
            <h3>Pesos disponibles</h3>
          </div>
          <div>
            <Table striped bordered hover variant="light">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Peso</th>
                  <th>Medida</th>
                  <th>Sabor</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                {weights.length > 0
                  ? weights.map((w, index) => (
                      <tr key={index + 1}>
                        <td>{index + 1}</td>
                        <td>{w.weight}</td>
                        <td>{w.measure}</td>
                        <td>{w.flavor}</td>
                        <td>{w.quantity}</td>
                        <td>${w.price}</td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </Table>
          </div>
          <div>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Control
                  type="text"
                  placeholder="Peso"
                  value={weight}
                  name={"weight"}
                  required
                  onChange={(e) => handleInputChange(e)}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridMeasure">
                <Form.Select
                  value={measure}
                  name={"measure"}
                  required
                  onChange={(e) => handleInputChange(e)}
                >
                  <option>Seleccionar Medida</option>
                  {measures.length > 0
                    ? measures.map((m) => (
                        <option id={m._id} key={m._id} value={m.name}>
                          {m.name}
                        </option>
                      ))
                    : null}
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridFlavors">
                <Form.Select
                  value={flavor}
                  name={"flavor"}
                  required
                  onChange={(e) => handleInputChange(e)}
                >
                  <option>Seleccionar Sabor</option>
                  {Flavors.length > 0
                    ? Flavors.map((c) => (
                        <option id={c._id} key={c._id} value={c.name}>
                          {c.name}
                        </option>
                      ))
                    : null}
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Control
                  type="number"
                  placeholder="Cantidad"
                  value={quantity}
                  name={"quantity"}
                  required
                  onChange={(e) => handleInputChange(e)}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Control
                  type="number"
                  placeholder="Precio"
                  value={price}
                  name={"price"}
                  required
                  onChange={(e) => handleInputChange(e)}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Button variant="info" onClick={addWeight}>
                  Agregar
                </Button>
              </Form.Group>
            </Row>
          </div>
        </div>

        <Form.Group className="mb-3" controlId="formGridAddress1">
          <Form.Label>Descripcion</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Descripcion"
            style={{ height: "100px" }}
            value={description}
            name={"description"}
            required
            onChange={(e) => handleInputChange(e)}
          />
        </Form.Group>
      </Form>
      <Button variant="info" onClick={postNewProduct}>
        Guardar
      </Button>
      {!showDelete ? null : (
        <Button
          variant="error"
          style={{ color: "#a93226 ", fontWeight: "bold" }}
          onClick={deleteProduct}
        >
          Eliminar Producto
        </Button>
      )}
      {!deletingProduct ? null : <Spinner />}
      <br />
      <br />
    </div>
  );
}

export default NewProduct;
