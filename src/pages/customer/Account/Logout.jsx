import React from "react";
import { useAuth } from "../Account/AuthProvider";

const Logout = () => {
  const { signout } = useAuth();

  // Perform the logout action when this component is rendered
  signout();

  // You can also redirect the user to a different page after logging out
  // For example, you can use the `useNavigate` hook from 'react-router-dom'

  return (
    <div>
      Logging out...
      {/* You can add a loading spinner or any other user feedback here */}
    </div>
  );
};

export default Logout;
