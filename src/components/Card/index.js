import { useNavigate } from "react-router-dom";
function Card({nombre, redirect, ...events}) {
  const navigate = useNavigate()
  
  return (
    <div id={nombre} className="btn btn-primary col card" onClick={(e) => {
      if(Object.entries(events).length > 0) {
        events.onClick(e)
      } else {
        navigate(redirect)
      }
    }}>
      <div className="card-body">
        <p className="card-text">{nombre}</p>
      </div>
    </div>
  );
}

export default Card;
