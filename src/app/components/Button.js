const defaultClasses =
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";

export default function Button({ className, ...props }, ref) {
  return (
    <button className={`${defaultClasses} ${className}`} ref={ref} {...props} />
  );
}
