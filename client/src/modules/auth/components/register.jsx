import Input from "../../form/components/input";
import { Link } from "react-router-dom";
import Button from "../../form/components/button";
import { useMutateRegister } from "../api";
import { useFormik } from "formik";

function Register() {
  const initialFormValues = {
    username: "",
    password: "",
  };
  const registerUser = useMutateRegister();
  const { getFieldProps, handleSubmit, resetForm } = useFormik({
    initialValues: initialFormValues,
    onSubmit: (values) => {
      registerUser.mutate(values);
      resetForm(initialFormValues);
    },
  });
  return (
    <div className="grid place-items-center min-h-screen">
      <div className="space-y-4">
        <h1 className="text-2xl text-center uppercase">register</h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input className="w-56" label="User Name" {...getFieldProps("username")} />
          <Input className="w-56" label="Password" type="password" {...getFieldProps("password")} />
          <Button type="submit">Register</Button>
        </form>

        <div className="text-center">
          <div className="relative">
            <p className="p-2 bg-gray-50 rounded text-xs text-gray-300">OR</p>
          </div>

          <p className="p-2">
            <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
