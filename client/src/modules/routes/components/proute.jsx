import { Redirect, Route } from "react-router-dom";
import { useGetUser } from "../../auth/api";
function Proute({ reverse = false, ...props }) {
  const { data: username } = useGetUser();
  const redirect = reverse === true ? "/login" : reverse === false ? "/" : "";

  return Boolean(username) === reverse ? <Route {...props} /> : <Redirect to={redirect} />;
}

export default Proute;
