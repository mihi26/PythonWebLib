import {Redirect, Route} from "react-router-dom";
import {useMemo} from "react";

export const PrivateRoute = (props) => {
  const isLoggedIn = useMemo(() => localStorage.getItem("@token") ,[localStorage.getItem("@token")])
  return isLoggedIn ? <Route {...props} /> :   <Redirect to="/login" />;
}
