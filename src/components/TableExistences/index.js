import { useState, useEffect, useContext } from "react";
import Context from "../../context/cellarContext";
import { getCellarExistence } from "../../services/cellarService";
import "./styles.css"

function TableExistences({ getInfo, productId, getFunction }) {
  const [existences, setExistences] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const { cellar } = useContext(Context);

  const getExistence = () => {
    getCellarExistence(cellar.id)
      .then(res => {
        setExistences(res)
        setSuggestions(res)
      })
  }

  useEffect(() => {
    getExistence()
    if (getFunction) getFunction(getExistence)
  }, []);

  useEffect(() => {
    const filterExistences = existences.filter(elemt => elemt.id === productId)
    if(filterExistences.length > 0) {
      setSuggestions(filterExistences)
    } else {
      setSuggestions(existences)
    }
  }, [productId])

  const handleClick = (e) => {
    const {id} = e.target.parentNode
    const [newId, description, flag, um, dueDate] = id.split('@')
    console.log(e.target)
    getInfo({
      id: newId,
      description,
      flag,
      um,
      dueDate: new Date(dueDate).toISOString().split('T')[0]
    })
  }

  return (
    <div className="w-100 sizing rounded h-100">
      <div className="table-responsive w-100 h-100">
        <table
          id="table-existence"
          className="table table-light align-middle table-striped border-danger text-center table-bordered h-100 m-0 w-100 rounded"
          style={{ border: "#FE7F29 solid 2px" }}
        >
          <thead>
            <tr>
              <th>Ref.</th>
              <th>Descripcion</th>
              <th>Hablador</th>
              <th>Existencia</th>
              <th>U.M</th>
              <th>Vence</th>
            </tr>
          </thead>
          <tbody>
            {suggestions
              ? suggestions.map((elemt) => (
                elemt.total > 0 &&
                  <tr
                    id={`${elemt.id}@${elemt.description}@${elemt.flag}@${elemt.um}@${elemt.due_date}`}
                    onClick={getInfo ? handleClick : null} 
                  >
                    <td>{elemt.id}</td>
                    <td>{elemt.description}</td>
                    <td>{elemt.flag.toUpperCase()}</td>
                    <td>{elemt.total}</td>
                    <td>{elemt.um}</td>
                    <td>{elemt.due_date}</td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableExistences;
