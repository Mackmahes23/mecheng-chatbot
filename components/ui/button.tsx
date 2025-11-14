export function Button({ className = "", ...props }) {
  return (
    <button
      className={
        "px-4 py-2 rounded-md bg-blue-600 text-white " + className
      }
      {...props}
    />
  );
}