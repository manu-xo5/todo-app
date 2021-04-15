import Input from "../../form/components/input";
import { useFormik } from "formik";
import Button from "../../form/components/button";
import { useMutateLogin } from "../api";
import { Link } from "react-router-dom";

function Login() {
  const initialFormValues = {
    username: "",
    password: "",
  };
  const registerUser = useMutateLogin();
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
        <h1 className="text-2xl text-center uppercase">login</h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input
            className="w-56"
            label="User Name"
            autoComplete="username"
            {...getFieldProps("username")}
          />
          <Input
            className="w-56"
            label="Password"
            type="password"
            autoComplete="current-password"
            {...getFieldProps("password")}
          />
          <Button type="submit">Login</Button>
        </form>

        <div className="text-center">
          <div className="relative">
            <p className="p-2 bg-gray-50 rounded text-xs text-gray-300">OR</p>
          </div>

          <p className="p-2">
            <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
