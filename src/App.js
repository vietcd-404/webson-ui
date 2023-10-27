import { Routes, Route } from "react-router-dom";
import "./App.css";
// import { ProtectedRoute } from "./components/ProtectedRoute";

import AdminRouter from "./router/AdminRouter";
import CustomerRouter from "./router/CustomerRouter";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/*" element={<AdminRouter />} />
        <Route path="/*" element={<CustomerRouter />} />
      </Routes>
    </div>
  );
};

export default App;
