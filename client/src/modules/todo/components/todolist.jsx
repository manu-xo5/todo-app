import { useState } from "react";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { useMutateDeleteTodo, useMutateUpdateTodo } from "../api";
import UpdateTodoForm from "./update-todo-form";

function TodoList({ todoList, title }) {
  const [isEditing, setIsEditing] = useState(false);
  const deleteTodo = useMutateDeleteTodo();
  const updateTodo = useMutateUpdateTodo();

  return (
    <div className="p-2">
      <p className="mb-3 text-center text-xl font-medium">{title}</p>
      <ul className="text-lg">
        {todoList.map((todo, idx) => (
          <li key={todo._id} className="relative group">
            {isEditing ? (
              <UpdateTodoForm
                todo={todo}
                todoListKey={title}
                onUpdate={() => {
                  setIsEditing(false);
                }}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <>
                <label className="p-2 block transition-colors ease-out group-hover:bg-gray-50">
                  <input
                    type="checkbox"
                    onChange={({ currentTarget }) =>
                      updateTodo.mutate({
                        todoId: todo._id,
                        todoListKey: title,
                        isFinished: currentTarget.checked,
                      })
                    }
                    checked={todo.isFinished}
                  />
                  <span className="pl-3">{todo.todo}</span>
                </label>
                <span className="absolute top-0 right-0 p-3 flex gap-x-3 opacity-0 transition-opacity ease-out text-gray-400 group-hover:opacity-100">
                  <FaPencilAlt
                    className="cursor-pointer hover:text-black"
                    onClick={() => setIsEditing(true)}
                  />
                  <FaTrash
                    className="cursor-pointer hover:text-black"
                    onClick={() =>
                      deleteTodo.mutate({
                        todoDelete: todo.todo,
                        todoListKey: title,
                      })
                    }
                  />
                </span>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
