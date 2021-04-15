import { useFormik } from "formik";
import Input from "../../form/components/input";
import { useMutateTodoListTodo } from "../api";

function CreateTodoForm({ userKey, todoListKey }) {
  const createTodo = useMutateTodoListTodo(userKey);
  const { getFieldProps, handleSubmit, resetForm } = useFormik({
    onSubmit: (values) => {
      createTodo.mutate(values);
      resetForm({
        todoListKey,
        todo: "",
      });
    },
    initialValues: {
      todoListKey,
      todo: "",
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <Input
        placeholder={`Add New Todo to "${todoListKey}"`}
        className="px-2 py-3 border-gray-300 w-full rounded"
        {...getFieldProps("todo")}
      />
    </form>
  );
}

export default CreateTodoForm;
