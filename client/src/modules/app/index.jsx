import { Link } from "react-router-dom";
import { useGetUser } from "../auth/api";
import Routes from "../routes";
import { useToken } from "../auth/context/token";

function App() {
  const { setToken } = useToken();
  useGetUser();
  return (
    <main className="bg-gray-50">
      <Link to="/">Home</Link>
      <button onClick={() => setToken("")}>Logout</button>
      <Routes />
    </main>
  );
}

export default App;
