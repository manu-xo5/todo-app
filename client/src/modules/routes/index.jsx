import { Route, Switch } from "react-router-dom";
import Login from "../auth/components/login";
import Register from "../auth/components/register";
import TodoListsList from "../todo";
import Proute from "./components/proute";
const routes = [
  {
    path: "/login",
    component: Login,
    isPrivate: false,
  },
  {
    path: "/register",
    component: Register,
    isPrivate: false,
  },

  {
    path: "/",
    component: TodoListsList,
    isPrivate: true,
  },
];

function Routes() {
  return (
    <Switch>
      {routes.map((route) =>
        route.isPrivate != null ? (
          <Proute reverse={route.isPrivate} {...route} />
        ) : (
          <Route {...route} />
        )
      )}
    </Switch>
  );
}

export default Routes;
