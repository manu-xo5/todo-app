import { filterNull } from "../utils.js";

async function todoListRoutes(fastify) {
  const { db, ObjectId } = fastify.mongo;

  fastify.get(
    "/todos",
    {
      preValidation: [fastify.authenticate],
    },
    async (req) => {
      const user = await db
        .collection("users")
        .findOne({ _id: ObjectId(req.user._id) });

      if (!user) throw new Error("No user");

      const normTodoLists = Object.entries(user.todoLists).map(
        ([todoListKey, todoList]) => ({
          title: todoListKey,
          todoList,
        })
      );
      return { todoLists: normTodoLists };
    }
  );

  fastify.post(
    "/todos/",
    {
      preValidation: [fastify.authenticate],
    },
    async (req) => {
      const { todoListKey } = req.body;

      const user = await db
        .collection("users")
        .findOne({ _id: ObjectId(req.user._id) });

      await user.update({ [`todoLists.${todoListKey}`]: [] });

      return true;
    }
  );

  fastify.post("/:userKey/todos/:todoListKey", async (req) => {
    const { todo } = req.body;
    const { userKey, todoListKey } = req.params;

    const newTodoTodo = String(todo);
    const user = db.get(userKey);
    if (!user) throw new Error("No user");

    if (!user.todoLists[todoListKey]) user.todoLists[todoListKey] = [];
    user.todoLists[todoListKey].push({ todo: newTodoTodo, isFinished: false });

    return user.todoLists;
  });

  fastify.put("/:userKey/todos/:todoListKey", async (req) => {
    const { newTodoListKey } = req.body;
    const { userKey, todoListKey } = req.params;

    const user = db.get(userKey);
    if (!user) throw new Error("No user");
    if (!user.todoLists[todoListKey]) throw new Error("No Todolist found");

    user.todoLists[newTodoListKey] = user.todoLists[todoListKey];
    delete user.todoLists[todoListKey];

    return { todoLists: user.todoLists };
  });

  fastify.put("/:userKey/todos/:todoListKey/todo", async (req) => {
    const { todoKey, todo, isFinished } = req.body;
    const { userKey, todoListKey } = req.params;

    const user = db.get(userKey);
    const _newTodoValues = filterNull({ todo, isFinished });
    Object.assign(user.todoLists[todoListKey][todoKey], _newTodoValues);

    return user;
  });

  fastify.delete("/:userKey/todos/:todoListKey/:todoDelete", async (req) => {
    const { userKey, todoListKey, todoDelete } = req.params;
    const user = db.get(userKey);
    if (!user.todoLists[todoListKey]) throw new Error("Todo List not found");
    if (user.todoLists[todoListKey][todoDelete] == null)
      throw new Error("Todo not found");
    user.todoLists[todoListKey].splice(todoDelete, 1);
    return user;
  });

  fastify.delete("/:userKey/todos/:todoListKey", async (req) => {
    const { userKey, todoListKey } = req.params;
    const user = db.get(userKey);
    if (!user.todoLists[todoListKey]) throw new Error("Todo List not found");
    delete user.todoLists[todoListKey];
    return user;
  });
}

export { todoListRoutes };
