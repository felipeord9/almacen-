import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Registro from "./pages/Registro";
import Movimientos from "./pages/Movimientos";
import Existencias from "./pages/Existencias";
import Modules from "./pages/Modules";
import { UserContextProvider } from "./context/userContext";
import { CellarContextProvider } from "./context/cellarContext";

function App() {
  return (
    <UserContextProvider>
      <CellarContextProvider>
        <Router>
          <div className="container text-light">
            <Routes>
              <Route exact path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={<PrivateRoute component={Home} />} />
              <Route path="/modulos" element={<PrivateRoute component={Modules} />} />
              <Route
                path="/registro"
                element={<PrivateRoute component={Registro} />}
              />
              <Route
                path="/movimientos"
                element={<PrivateRoute component={Movimientos} />}
              />
              <Route
                path="/existencias"
                element={<PrivateRoute component={Existencias} />}
              />
            </Routes>
          </div>
        </Router>
      </CellarContextProvider>
    </UserContextProvider>
  );
}

export default App;
