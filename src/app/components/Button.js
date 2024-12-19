const defaultClasses =
  "bg-primary text-primary-foreground shadow hover:bg-primary/90 h-8 rounded-md px-3 text-xs inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";

const Button = ({ className, ...props }, ref) => {
  return (
    <button className={`${defaultClasses} ${className}`} ref={ref} {...props} />
  );
};

export default Button;
