import { useFormik } from "formik";
import Input from "../../form/components/input";
import { useMutateNewTodoList } from "../api";

function CreateTodoListForm({ userKey }) {
  const initialFormValues = {
    todoListKey: "",
  };

  const createTodoList = useMutateNewTodoList(userKey);
  const { handleSubmit, getFieldProps, resetForm } = useFormik({
    initialValues: initialFormValues,
    onSubmit: (values) => {
      createTodoList.mutate(values);
      resetForm(initialFormValues);
    },
  });
  return (
    <form onSubmit={handleSubmit}>
      <Input
        className="px-2 py-3 w-full border border-gray-300 rounded text-blue-600"
        placeholder="Add New TodoList"
        {...getFieldProps("todoListKey")}
      />
    </form>
  );
}

export default CreateTodoListForm;
