import CreateTodoForm from "./create-todo-form";
import CreateTodoListForm from "./create-todolist-form";
import TodoList from "./todolist";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { useState } from "react";
import UpdateTodoListKeyForm from "./update-todolist-key-form";

function TodoListsList({ todoLists, handleDeleteTodoList, userKey }) {
  const [selectedTodoList, setSelectedTodoList] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="bg-white border border-solid border-gray-100 shadow-lg rounded-xl">
      <div className="p-3 min-h-screen-half flex gap-6 items-start">
        <div className="flex-grow space-y-6">
          {todoLists.length === 0 ? (
            <p className="p-8 text-2xl text-center text-gray-300">No TodoLists Yet</p>
          ) : (
            <ul className="border border-gray-300 rounded divide-y divide-gray-300 text-gray-600 overflow-hidden">
              {todoLists.map((todoList) => (
                <li
                  key={todoList.title}
                  className="relative px-4 py-2 bg-white cursor-pointer group"
                  onClick={() => setSelectedTodoList(todoList)}
                >
                  {isEditing ? (
                    <UpdateTodoListKeyForm
                      todoListKey={todoList.title}
                      onCancel={() => setIsEditing(false)}
                      onUpdate={() => setIsEditing(false)}
                    />
                  ) : (
                    <>
                      <span>{todoList.title}</span>
                      <span className="absolute top-0 right-0 p-3 flex gap-x-3 text-gray-400">
                        <FaPencilAlt
                          className="opacity-0 transition-opacity hover:text-black group-hover:opacity-100"
                          onClick={() => setIsEditing(true)}
                        />
                        <FaTrash
                          className="opacity-0 transition-opacity hover:text-black group-hover:opacity-100"
                          onClick={() => handleDeleteTodoList({ todoListKey: todoList.title })}
                        />
                      </span>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
          <CreateTodoListForm userKey={userKey} />
        </div>

        <div className="max-w-2xl flex-grow space-y-6">
          {selectedTodoList ? (
            <>
              <TodoList todoList={selectedTodoList.todoList} title={selectedTodoList.title} />
              <CreateTodoForm
                key={selectedTodoList.title}
                todoListKey={selectedTodoList.title}
                userKey={userKey}
              />
            </>
          ) : (
            <p className="p-8 text-2xl text-center text-gray-300">Select a TodoList</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TodoListsList;
