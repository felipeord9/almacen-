import { useState, useEffect, useContext, useRef } from "react";
import sweal from "sweetalert";
import CellarContext from "../../context/cellarContext";
import UserContext from "../../context/userContext";
import { getAllProducts, getOneProduct } from "../../services/productService";
import { createMovement } from "../../services/movementService";
import { getAllPositions } from "../../services/positionService";
import { config } from "../../config";
import "./styles.css";

function MovementForm({ typeForm, ...props }) {
  const { colaborator } = useContext(UserContext);
  const { cellar, setCellar } = useContext(CellarContext);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [positions, setPositions] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [search, setSearch] = useState({
    searchRef: "",
    searchDesc: "",
    amount: "",
    position: "",
    note: ""
  });
  const selectPositionRef = useRef()

  useEffect(() => {
    getAllProducts().then((res) => {
      setProducts(res);
      setSuggestions(res);
    });
    getAllPositions().then((data) => setPositions(data));
  }, []);

  const getMovements = () => {
    const data = fetch(`${config.apiUrl}/cellars/${cellar.id}`)
      .then((res) => res.json())
      .then((res) => {
        setCellar(res.data);
        return res.data;
      });
    return data;
  };

  useEffect(() => {
    async function setData() {
      const { infoMovement } = props;

      if (infoMovement) {
        let result = await getOneProduct(infoMovement.id);
        if (result) {
          setProduct(result);
        }
        setSearch({
          ...search,
          searchRef: infoMovement.id,
          position: infoMovement.position
        });
      }
    }
    setData();
  }, [props.infoMovement]);

  const cleanForm = () => {
    if (props.setInfoMovement) {
      props.setInfoMovement(null);
    }
    setProduct(null);
    selectPositionRef.current.selectedIndex = 0
    setSearch({
      searchRef: "",
      searchDesc: "",
      amount: "",
      position: "",
      note: ""
    });
  };

  const handleFindRef = async (e) => {
    let { value } = e.target;
    value = parseInt(value);
    if (props.getProductId) {
      props.getProductId(value);
    }
    let result = await getOneProduct(value);
    if (result) {
      setSuggestions([result]);
      setProduct(result);
    } else {
      if (props.setInfoMovement) {
        props.setInfoMovement(null);
      }
      if (search) {
        search.searchDesc = "";
        search.position = "";
        setProduct(null);
        setSuggestions(products);
      } else {
        cleanForm();
      }
    }
  };

  const handleFindDesc = (e) => {
    const { value } = e.target;
    let select = document.getElementById("select-products");
    select.value = select.options[0].value;
    let result = products.filter((product) =>
      product.description.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(result);
    setProduct(null);
    search.searchRef = "";
  };

  const handleChange = (e) => {
    let { value, name } = e.target;
    setSearch({
      ...search,
      [name]: value,
    });
  };

  const handleSelectProduct = async (e) => {
    const { value } = e.target;
    const ref = value.split(" ")[0];
    const result = await getOneProduct(ref);
    setProduct(result);
    setSearch({
      ...search,
      searchRef: parseInt(ref),
    });
    setSuggestions([result]);
  };

  const handleSelectFlag = (e) => {
    const { value } = e.target;
    setSearch({
      ...search,
      position: value,
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const movementType = e.target.name;
    if (product && search.amount && search.position) {
      const body = {
        productId: product.id,
        colaboratorId: colaborator.id,
        cellarId: cellar.id,
        amount: parseInt(search.amount),
        movementType,
        note: search.note,
        positionId: parseInt(search.position.split(" ")[1]),
        createdAt: new Date(),
      };

      if (movementType === "salida") {
        const { movements } = await getMovements();
        const filMov = movements.filter(
          (elem) =>
          elem.product.id === product.id &&
          elem.position.name === search.position &&
          elem.deleted === false
        );

        const amountEntradas = filMov
          .filter(
            (elem) =>
              elem.movementType === "entrada" && elem.position.name === search.position
          )
          .reduce((a, b) => a + b.amount, 0);
        const amountSalidas = filMov
          .filter(
            (elem) =>
              elem.movementType === "salida" && elem.position.name === search.position
          )
          .reduce((a, b) => a + b.amount, 0);

        if (amountEntradas - amountSalidas >= search.amount) {
          sweal({
            title: "ESTAS SEGURO?",
            text: ` Vas a retirar ${search.amount}${product.um} de ${product.description}`,
            buttons: ["Cancelar", "Si, continuar"],
          }).then(async (deleted) => {
            if (deleted) {
              const { movements } = await getMovements();
              const filMov = movements.filter(
                (elem) =>
                  elem.product.id === product.id &&
                  elem.position.name === search.position &&
                  elem.deleted === false
              );

              const amountEntradas = filMov
                .filter(
                  (elem) =>
                    elem.movementType === "entrada" &&
                    elem.position.name === search.position
                )
                .reduce((a, b) => a + b.amount, 0);
              const amountSalidas = filMov
                .filter(
                  (elem) =>
                    elem.movementType === "salida" &&
                    elem.position.name === search.position
                )
                .reduce((a, b) => a + b.amount, 0);

              if (amountEntradas - amountSalidas >= search.amount) {
                createMovement(body).then(() => {
                  sweal({
                    text: "Se ha registrado la salida exitosamente!",
                    icon: "success",
                  });
                });
                cleanForm();
                props.getFunctionExistence();
                getMovements();
              } else {
                sweal({
                  title: "¡ATENCIÓN!",
                  text: "No hay la cantidad suficiente para hacer el movimiento",
                  icon: "warning",
                  button: "Cerrar",
                  dangerMode: true,
                  timer: 3000,
                });
                props.getFunctionExistence();
              }
            }
          });
        } else {
          sweal({
            title: "¡ATENCION!",
            text: "No hay la cantidad suficiente para hacer el movimiento",
            icon: "warning",
            button: "Cerrar",
            dangerMode: true,
            timer: 3000,
          });
          props.getFunctionExistence();
        }
      } else {
        sweal({
          title: "ESTAS SEGURO?",
          text: `Vas a **AGREGAR** ${search.amount}${product.um} de ${product.description} - ${search.position}`,
          confirmButtonText: "Aceptar",
          buttons: ["Cancelar", "Si, continuar"],
          dangerMode: true,
          html: true,
        }).then((deleted) => {
          if (deleted) {
            createMovement(body).then((res) => {
              sweal({
                text: "Se ha registrado la entrada exitosamente!",
                icon: "success",
              });
            });
            getMovements();
            cleanForm();
          }
        });
      }
    } else {
      sweal({
        title: "ATENCION",
        text: "Te hace falta llenar algunos campos",
        icon: "warning",
        button: "cerrar",
        dangerMode: true,
        timer: 3000,
      });
    }
  };

  return (
    <form className="d-flex flex-column gap-2 w-100" style={{ fontSize: 13 }}>
      <div className="d-flex align-items-start card bg-light p-4">
        <p className="m-0">
          <strong>DATOS DEL PRODUCTO</strong>
        </p>
        <div className="row row-cols-sm-1 row-cols-sm-2">
          <div className="d-flex flex-column justify-content-start">
            <label>Código de producto</label>
            <input
              id="Referencia"
              name="searchRef"
              type="number"
              className="form-control"
              value={product ? product.id : search.searchRef}
              onChange={(e) => {
                handleChange(e);
                handleFindRef(e);
              }}
            />
          </div>
          <div className="d-flex flex-column justify-content-start">
            <label>Descripción de producto</label>
            <div className="combobox-container">
              <input
                name="searchDesc"
                type="text"
                className={
                  typeForm === "salida"
                    ? "form-control"
                    : "container-input form-control"
                }
                value={
                  product
                    ? product.description
                    : props.infoMovement
                    ? props.infoMovement.description
                    : search.searchDesc
                }
                onChange={(e) => {
                  handleFindDesc(e);
                  handleChange(e);
                }}
                disabled={typeForm === "salida" ? true : false}
              />
              <select
                id="select-products"
                className={
                  typeForm === "salida"
                    ? "d-none"
                    : "w-100 h-100 container-select form-select"
                }
                onChange={handleSelectProduct}
              >
                <option id={0} name="product" disabled selected>
                  -- SELECCIONAR UN PRODUCTO --
                </option>
                {suggestions.map((product, index) => (
                  <option id={product.id} name="product">
                    {product.id + " - " + product.description}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="d-flex flex-column justify-content-start">
            <label>Posición</label>
            <div className="combobox-container">
              <select
                id="select-positions"
                ref={selectPositionRef}
                className="w-100 h-100 container-select form-select"
                onInput={handleSelectFlag}
                value={
                  search.position
                    ? search.position
                    : props.infoMovement
                    ? props.infoMovement.position
                    : null
                }
                disabled={typeForm === "salida" && true}
              >
                <option id={0} name="position" disabled selected>
                  -- SELECCIONAR POSICIÓN --
                </option>
                {positions?.map((position, index) => (
                  <option id={position.id} name="position">
                    {position.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="d-flex flex-column justify-content-start">
            <label>U.M.</label>
            <input
              type="text"
              value={
                product
                  ? product["um"]
                  : props.infoMovement
                  ? props.infoMovement.um
                  : ""
              }
              className="form-control"
              disabled
            />
          </div>
          {/* <div className="d-flex flex-column justify-content-start w-100">
            <label>Fecha de vencimiento</label>
            <input
              name="dueDate"
              type="date"
              value={
                props.infoMovement ? props.infoMovement.dueDate : search.dueDate
              }
              className="form-control"
              disabled={typeForm === "salida" ? true : false}
              onChange={handleChange}
            />
          </div> */}
          <div className="d-flex flex-column justify-content-start w-100">
            <label>Cantidad</label>
            <input
              name="amount"
              type="number"
              value={search.amount}
              className="form-control"
              onChange={handleChange}
            />
          </div>
          <div className="input-group mt-2">
            <span class="input-group-text">Nota</span>
            <textarea
              name="note"
              class="form-control"
              aria-label="With textarea"
              value={search.note}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
      </div>
      <div className="d-flex flex-row align-items-center justify-content-evenly">
        <button
          name={typeForm}
          className={
            typeForm === "entrada"
              ? "btn btn-success w-100"
              : "btn btn-danger text-light w-100"
          }
          //style={typeForm === "salida" ? { background: "#FE7F29"} : null}
          onClick={handleClick}
        >
          REGISTRAR {typeForm.toUpperCase()}
        </button>
      </div>
    </form>
  );
}

export default MovementForm;
