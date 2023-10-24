import { Routes, Route } from "react-router-dom";
import "./App.css";
// import { ProtectedRoute } from "./components/ProtectedRoute";

import AdminRouter from "./router/AdminRouter";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/*" element={<AdminRouter />} />
      </Routes>
    </div>
  );
};

export default App;
