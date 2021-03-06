import { useMutation, useQuery, useQueryClient } from "react-query";
import { useToken } from "../auth/context/token";
import { useGetUser } from "../auth/api";
import { filterNull } from "../utils";

function commanHeaders(token) {
  return {
    headers: {
      "content-type": "application/json",
      authorization: "Bearer " + token,
    },
  };
}

function useGetTodoLists() {
  const { data: userKey } = useGetUser();
  const { token } = useToken();

  return useQuery(["todoLists", userKey], async () => {
    const res = await fetch("/todos", { ...commanHeaders(token) });
    const { todoLists, message } = await res.json();

    if (message != null) throw new Error(message);
    if (!todoLists) throw new Error("Failed to load todoLists");

    return todoLists;
  });
}

function useMutateTodoListTodo(userKey) {
  const queryClient = useQueryClient();
  const { token } = useToken();

  return useMutation(
    ["todoLists", userKey],
    async (values) => {
      const res = await fetch("/todos/todo", {
        method: "post",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      return res.ok;
    },
    {
      onMutate: (values) => {
        queryClient.setQueryData(["todoLists", userKey], (oldData) => {
          const newData = oldData.map((todoList) => {
            if (todoList.title === values.todoListKey) {
              todoList.todoList.push(values.todo);
            }
            return todoList;
          });
          return newData;
        });
      },
      onSettled: async () => {
        queryClient.invalidateQueries(["todoLists", userKey]);
      },
    }
  );
}

function useMutateNewTodoList(userKey) {
  const queryClient = useQueryClient();
  const { token } = useToken();

  return useMutation(
    ["todoLists", userKey],
    async (values) => {
      const res = await fetch("/todos/list", {
        method: "post",
        body: JSON.stringify(values),
        ...commanHeaders(token),
      });
      const { todoLists, message } = await res.json();

      if (message) throw new Error(message);
      if (!todoLists) throw new Error("No TodoLists in response");

      return todoLists;
    },
    {
      onMutate: (values) => {
        queryClient.setQueryData(["todoLists", userKey], (oldData) => {
          oldData.push({
            title: values.todoListKey,
            todoList: [],
          });

          return [...oldData];
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries(["todoLists", userKey]);
      },
    }
  );
}

function useMutateUpdateTodoListKey() {
  const { data: username } = useGetUser();
  const { token } = useToken();
  const queryClient = useQueryClient();
  const userKey = username;

  return useMutation(
    ["todoLists", userKey],
    async (values) => {
      const res = await fetch("/todos/list", {
        method: "put",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      return res.ok;
    },
    {
      onSettled: () => queryClient.invalidateQueries(["todoLists", userKey]),
    }
  );
}

function useMutateDeleteTodoList() {
  const { data: username } = useGetUser();
  const { token } = useToken();
  const queryClient = useQueryClient();
  const userKey = username;

  return useMutation(
    ["todoLists", userKey],
    async (values) => {
      const { todoListKey } = values;
      const res = await fetch(`/todos/${todoListKey}`, {
        method: "delete",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      return res.ok;
    },
    {
      onMutate: (values) => {
        queryClient.setQueryData(["todoLists", userKey], (oldData) => {
          return oldData.filter((todoList) => todoList.title === values.todoListKey);
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries(["todoLists", userKey]);
      },
    }
  );
}

function useMutateDeleteTodo() {
  const { token } = useToken();
  const queryClient = useQueryClient();
  const { data: username } = useGetUser();
  const userKey = username;

  return useMutation(
    ["todoLists", userKey],
    async (values) => {
      const { todoListKey, todoDelete } = values;
      const res = await fetch(`/todos/${todoListKey}/${todoDelete}`, {
        method: "delete",
        headers: { Authorization: "Bearer " + token },
      });

      return res.ok;
    },
    {
      onMutate: (values) => {
        const { todoListKey, todoDelete } = values;
        queryClient.setQueryData(["todoLists", userKey], (oldData) => {
          const todoList = oldData.find((todoList) => todoList.title === todoListKey);
          todoList.todoList = todoList.todoList.filter((_todo) => _todo.todo !== todoDelete);
          return [...oldData];
        });
      },
      onSettled: (values) => {
        if (!values) queryClient.invalidateQueries(["todoLists", userKey]);
      },
    }
  );
}

function useMutateUpdateTodo() {
  const { token } = useToken();
  const queryClient = useQueryClient();
  const { data: username } = useGetUser();
  const userKey = username;

  return useMutation(
    ["todoLists", userKey],
    async (values) => {
      const res = await fetch(`/todos/todo`, {
        method: "put",
        body: JSON.stringify(values),
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });

      return res.ok;
    },
    {
      onMutate: (values) => {
        const { todoListKey, todoId, todo, isFinished } = values;

        queryClient.setQueryData(["todoLists", userKey], (oldData) => {
          const todoList = oldData.find((todoList) => todoList.title === todoListKey);
          todoList.todoList = todoList.todoList.map((_todo) =>
            _todo._id === todoId ? Object.assign(_todo, filterNull({ todo, isFinished })) : _todo
          );
          return [...oldData];
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries(["todoLists", userKey]);
      },
    }
  );
}

export {
  useGetTodoLists,
  useMutateTodoListTodo,
  useMutateNewTodoList,
  useMutateUpdateTodo,
  useMutateDeleteTodoList,
  useMutateDeleteTodo,
  useMutateUpdateTodoListKey,
};
