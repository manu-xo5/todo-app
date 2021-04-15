import { useMutation, useQuery } from "react-query";
import { useToken } from "./context/token";

function useGetUser() {
  const { token } = useToken();

  return useQuery(
    ["user", token],
    async () => {
      const res = await fetch("/me", { headers: { Authorization: "Bearer " + token } });
      const { username, message } = await res.json();

      if (message) throw new Error(message);
      if (!username) throw new Error("No username in response");

      return username;
    },
    { retry: false }
  );
}

function useMutateLogin() {
  const { setToken } = useToken();

  return useMutation("token", async (values) => {
    const res = await fetch("/login", {
      method: "post",
      body: JSON.stringify(values),
      headers: { "Content-Type": "application/json" },
    });
    const { token, message } = await res.json();

    if (message) throw new Error(message);
    if (!token) throw new Error("No token in response");

    setToken(token);
    return token;
  });
}

function useMutateRegister() {
  return useMutation("register", async (values) => {
    const res = await fetch("/register", {
      method: "post",
      body: JSON.stringify(values),
      headers: { "Content-Type": "application/json" },
    });
    const { user, message } = await res.json();

    if (message) throw new Error(message);
    if (!user) throw new Error("No user in response");

    return user;
  });
}

export { useMutateLogin, useMutateRegister, useGetUser };
