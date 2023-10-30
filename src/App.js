import { Routes, Route } from "react-router-dom";
import "./App.css";
// import { ProtectedRoute } from "./components/ProtectedRoute";

import AdminRouter from "./router/AdminRouter";
import Main from "./components/customer/Main/Main";
import Home from "./pages/customer/Home";
import Shop from "./pages/customer/Shop";
import About from "./pages/customer/About";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/*" element={<AdminRouter />} />

        {/* Khách hàng  */}
        <Route
          path="/"
          element={
            <Main>
              <Home />
            </Main>
          }
        ></Route>
        <Route
          path="/shop"
          element={
            <Main>
              <Shop />
            </Main>
          }
        ></Route>
        <Route
          path="/about"
          element={
            <Main>
              <About />
            </Main>
          }
        ></Route>
      </Routes>
    </div>
  );
};

export default App;
