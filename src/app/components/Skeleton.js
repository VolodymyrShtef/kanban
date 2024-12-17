export default function Skeleton({ className, ...props }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-100 ${className}`}
      {...props}
    />
  );
}
