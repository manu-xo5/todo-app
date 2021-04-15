import { useFormik } from "formik";
import Input from "../../form/components/input";
import { useMutateUpdateTodo } from "../api";
import { FaCheck, FaTimes } from "react-icons/fa";

function UpdateTodoForm({ todo, todoKey, todoListKey, onUpdate, onCancel }) {
  const initialFormValues = {
    todoListKey,
    todoKey,
    todo: todo.todo,
  };

  const udpateTodo = useMutateUpdateTodo();
  const { handleSubmit, getFieldProps, isSubmitting } = useFormik({
    initialValues: initialFormValues,
    onSubmit: async (values) => {
      await udpateTodo.mutateAsync(values);
      onUpdate();
    },
  });

  return (
    <>
      <form onSubmit={handleSubmit} disabled={isSubmitting}>
        <Input className="p-2 w-full border border-black leading-none" {...getFieldProps("todo")} />
      </form>
      <span className="absolute top-0 right-0 m-1 p-2 flex items-center gap-x-3 rounded opacity-0 transition-opacity ease-out text-gray-400 group-hover:opacity-100 group-hover:bg-gray-50">
        <FaCheck className="cursor-pointer hover:text-black" onClick={handleSubmit} />
        <FaTimes className="cursor-pointer hover:text-black" onClick={onCancel} />
      </span>
    </>
  );
}

export default UpdateTodoForm;
