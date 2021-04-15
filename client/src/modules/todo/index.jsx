import { useGetUser } from "../auth/api";
import TodoListsListContainer from "./components/todoListsListContainer";

function TodoLists() {
  const userQuery = useGetUser();

  return (
    <section className="p-16">
      <h1 className="border-black text-3xl text-center text-black">TodoLists</h1>
      {userQuery.isLoading ? (
        <h1>Authenticating</h1>
      ) : userQuery.data ? (
        <TodoListsListContainer userKey={userQuery.data} />
      ) : userQuery.error ? (
        <h1>{userQuery.error}</h1>
      ) : (
        <h1>Failed to authenticate</h1>
      )}
    </section>
  );
}

export default TodoLists;
