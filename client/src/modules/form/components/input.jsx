/** @param {{label: string} | React.InputHTMLAttributes<HTMLInputElement>} props */
function Input({ label, className, ...props }) {
  return (
    <label className="block">
      <span style={{ display: "block" }}>{label}</span>
      <input className={"border border-black rounded " + className} {...props} />
    </label>
  );
}

export default Input;
