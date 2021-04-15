import { useGetTodoLists, useMutateDeleteTodoList } from "../api";
import TodoListsList from "./todoListsList";

function TodoListsListContainer({ userKey }) {
  const { error, isLoading, data: todoLists } = useGetTodoLists(userKey);
  const deleteTodoList = useMutateDeleteTodoList();

  return isLoading ? (
    <h1>Loading...</h1>
  ) : todoLists && "length" in todoLists ? (
    <TodoListsList
      userKey={userKey}
      todoLists={todoLists}
      handleDeleteTodoList={deleteTodoList.mutate}
    />
  ) : (
    <h1>{error || "Failed to load todo-lists"}</h1>
  );
}

export default TodoListsListContainer;
