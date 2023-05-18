import { useState, useEffect, useContext } from "react";
import sweal from "sweetalert";
import UserContext from "../../context/userContext";
import CellarContext from "../../context/cellarContext";
import { getAllProducts, getOneProduct } from "../../services/productService";
import { createMovement } from "../../services/movementService";
import "./styles.css";

const bandera = [
  {
    id: 0,
    nombre: "LOGISTICA",
  },
  {
    id: 1,
    nombre: "CALIDAD",
  },
  {
    id: 2,
    nombre: "PRODUCCION",
  },
];
function Registro() {
  const { colaborator } = useContext(UserContext);
  const { cellar } = useContext(CellarContext);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [suggestions, setSuggestions] = useState([...products]);
  const [search, setSearch] = useState({
    searchRef: "",
    searchDesc: "",
    amount: "",
    flag: "",
    note: "",
  });

  useEffect(() => {
    getAllProducts().then((res) => setProducts(res));
  }, []);

  const cleanForm = () => {
    setProduct(null);
    setSearch({
      searchDesc: "",
      searchRef: "",
      amount: "",
      flag: "",
      note: "",
    });
  };

  const handleFindRef = async (e) => {
    let { value } = e.target;
    value = parseInt(value);
    let result = await getOneProduct(value);
    if (result) {
      setSuggestions([result]);
      setProduct(result);
    } else {
      setProduct(null);
      search.searchDesc = "";
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
      flag: value,
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const movementType = e.target.name;

    if (product && search.amount) {
      console.log(search.flag);
      const body = {
        productId: product.id,
        colaboratorId: colaborator.id,
        cellarId: cellar.id,
        amount: parseInt(search.amount),
        movementType,
        note: search.note,
        flag: (search.flag.toLowerCase()),
        createdAt: new Date(),
      };

      if (movementType === "salida") {
        const { movements } = cellar;

        const filMov = movements.filter(
          (elem) => elem.product.id === product.id && elem.flag === (search.flag).toLowerCase()
        );

        const amountEntradas = filMov
          .filter((elem) => elem.movementType === "entrada")
          .reduce((a, b) => a + b.amount, 0);
        const amountSalidas = filMov
          .filter((elem) => elem.movementType === "salida")
          .reduce((a, b) => a + b.amount, 0);

        if (amountEntradas - amountSalidas >= search.amount) {
          sweal({
            title: "ESTAS SEGURO?",
            text: ` Vas a retirar ${search.amount}${product.um} de ${product.description}`,
            buttons: ["Cancelar", "Si, continuar"],
          }).then((deleted) => {
            if (deleted) {
              createMovement(body).then(() => {
                sweal({
                  text: "Se ha registrado la salida exitosamente!",
                  icon: "success",
                });
              });
              cleanForm();
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
        }
      } else {
        sweal({
          title: "ESTAS SEGURO?",
          text: `Vas a agregar ${search.amount}${product.um} de ${product.description}`,
          buttons: ["Cancelar", "Si, continuar"],
          dangerMode: true
        }).then((deleted) => {
          if (deleted) {
            console.log("POST");
            createMovement(body).then((res) => {
              console.log(res);
              sweal({
                text: "Se ha registrado la entrada exitosamente!",
                icon: "success",
              });
            });
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
    <div className="pt-4">
      <button
        className="btn btn-secondary mb-3"
        onClick={(e) => window.history.back()}
      >
        {"volver atras"}
      </button>
      <div className="fs-6 w-100">
        <h2 className="text-light text-center fs-5">REGISTRO DE MOVIMIENTO</h2>
        <form className="d-flex flex-column gap-2 fs-6">
          <div className="d-flex align-items-start card bg-light p-4">
            <p className="m-0">
              <strong>DATOS DEL PRODUCTO</strong>
            </p>
            <div className="d-flex flex-column justify-content-between gap-1 w-100 text-start">
              <div className="d-flex flex-column justify-content-start w-100">
                <label>Codigo de producto</label>
                <input
                  id="Referencia"
                  name="searchRef"
                  type="number"
                  value={product ? product.id : search.searchRef}
                  onChange={(e) => {
                    handleChange(e);
                    handleFindRef(e);
                  }}
                />
              </div>
              <div className="d-flex flex-column justify-content-start w-100">
                <label>Nombre de producto</label>
                <div className="combobox-container">
                  <input
                    name="searchDesc"
                    type="text"
                    className="container-input"
                    value={product ? product.description : search.searchDesc}
                    onChange={(e) => {
                      handleFindDesc(e);
                      handleChange(e);
                    }}
                  />
                  <select
                    id="select-products"
                    className="w-100 h-100 container-select"
                    onChange={handleSelectProduct}
                  >
                    <option id={0} name="product" disabled selected>
                      -- SELECCIONE UN PRODUCTO --
                    </option>
                    {suggestions.map((product, index) => (
                      <option id={product.id} name="product">
                        {product.id + " - " + product.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="d-flex flex-column justify-content-start w-100">
                <label>Bandera</label>
                <div className="combobox-container">
                  <input
                    name="flag"
                    type="text"
                    className="container-input"
                    value={search.flag}
                    onChange={handleChange}
                  />
                  <select
                    id="select-flags"
                    className="w-100 h-100 container-select"
                    onChange={handleSelectFlag}
                  >
                    <option id={0} name="flag" disabled selected>
                      -- SELECCIONE UNA BANDERA --
                    </option>
                    {bandera.map((flag, index) => (
                      <option id={flag.id} name="flag">
                        {flag.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="d-flex flex-column justify-content-start w-100">
                <label>U.M.</label>
                <input
                  type="text"
                  value={product ? product["um"] : ""}
                  disabled
                />
              </div>
              <div className="d-flex flex-column justify-content-startt w-100">
                <label>Cantidad</label>
                <input
                  name="amount"
                  type="number"
                  value={search.amount}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group mt-3">
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
              name="entrada"
              className="btn btn-success"
              onClick={handleClick}
            >
              REGISTRAR ENTRADA
            </button>
            <button
              name="salida"
              className="btn btn-danger"
              onClick={handleClick}
              
            >
              REGISTRAR SALIDA
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Registro;
