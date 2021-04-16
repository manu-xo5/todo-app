import fastifyMongodb from "fastify-mongodb";
import { filterNull } from "../utils.js";

async function todoListRoutes(/** @type {import('fastify').FastifyInstance} fastify */ fastify) {
  const { db, ObjectId } = fastify.mongo;

  fastify.get(
    "/todos",
    {
      preValidation: [fastify.authenticate],
    },
    async (req) => {
      const user = await db.collection("users").findOne({ _id: ObjectId(req.user._id) });

      if (!user) throw new Error("No user");

      const normTodoLists = Object.entries(user.todoLists).map(([todoListKey, todoList]) => ({
        title: todoListKey,
        todoList,
      }));
      return { todoLists: normTodoLists };
    }
  );

  /**
   * POST:/todos/list
   * create new todolist init. with empty array
   */
  fastify.post(
    "/todos/list",
    {
      preValidation: [fastify.authenticate],
    },
    async (req) => {
      const { todoListKey } = req.body;

      const user = await db
        .collection("users")
        .findOneAndUpdate(
          { _id: ObjectId(req.user._id) },
          { $set: { [`todoLists.${todoListKey}`]: [] } }
        );

      return true;
    }
  );

  /**
   * POST:/todos/
   * create new todo in todolist.
   */
  fastify.post(
    "/todos/todo",
    {
      preValidation: [fastify.authenticate],
    },
    async (req) => {
      const { todo, todoListKey } = req.body;
      const { user } = req;

      await db
        .collection("users")
        .findOneAndUpdate(
          { _id: ObjectId(user._id) },
          {
            $push: {
              [`todoLists.${todoListKey}`]: { _id: new ObjectId(), todo, isFinished: false },
            },
          }
        )
        .catch(() => {
          throw new Error("Failed to update");
        });

      return true;
    }
  );

  /**
   * PUT:/todos/list
   * renames todolist key to new one.
   */
  fastify.put(
    "/todos/list",
    {
      preValidation: [fastify.authenticate],
    },
    async (req) => {
      const { newTodoListKey, todoListKey } = req.body;
      const { user } = req;

      const res = await db
        .collection("users")
        .findOneAndUpdate(
          { _id: ObjectId(user._id) },
          { $rename: { [`todoLists.${todoListKey}`]: `todoLists.${newTodoListKey}` } },
          { projection: { todoLists: 1 } }
        )
        .catch(() => {
          throw new Error("Failed to find such todoLists ");
        });

      return { user: res };
      // return { todoLists: user.todoLists };
    }
  );

  /**
   * PUT:/todos/todo
   * renames todolist key to new one.
   */
  fastify.put(
    "/todos/todo",
    {
      preValidation: [fastify.authenticate],
    },
    async (req) => {
      const { todoId, todoListKey, todo, isFinished } = req.body;
      const { user } = req;
      // todo use filterNull

      const updatedTodo = filterNull({
        [`todoLists.${todoListKey}.$[a].todo`]: todo,
        [`todoLists.${todoListKey}.$[a].isFinished`]: isFinished,
      });

      await db
        .collection("users")
        .findOneAndUpdate(
          { _id: ObjectId(user._id) },
          { $set: updatedTodo },
          { arrayFilters: [{ "a._id": ObjectId(todoId) }] }
        );

      return true;
    }
  );

  /**
   * DELETE:/todos/:todoListKey
   * removes whole todoList from user.
   */
  fastify.delete(
    "/todos/:todoListKey",
    {
      preValidation: [fastify.authenticate],
    },
    async (req) => {
      const { todoListKey } = req.params;
      const { user } = req;

      await db
        .collection("users")
        .findOneAndUpdate(
          { _id: ObjectId(user._id) },
          { $unset: { [`todoLists.${todoListKey}`]: 1 } }
        );
      return true;
    }
  );

  /**
   * DELETE:/todos/:todoListKey/:todoDelete
   * removes todo from todoList.
   */
  fastify.delete(
    "/todos/:todoListKey/:todoDelete",
    {
      preValidation: [fastify.authenticate],
    },
    async (req) => {
      const { todoListKey, todoDelete } = req.params;
      const { user } = req;

      await db
        .collection("users")
        .findOneAndUpdate(
          { _id: ObjectId(user._id) },
          { $pull: { [`todoLists.${todoListKey}`]: { todo: todoDelete } } }
        );
      return true;
    }
  );
}

export { todoListRoutes };
