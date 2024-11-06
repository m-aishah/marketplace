import Link from "next/link";

export function Button({ variant = "", children, ...props }) {
  const baseClasses = "transition font-medium text-sm rounded-full text-center";
  const primaryClasses = variant.includes("blue")
    ? "bg-brand text-white hover:shadow-md hover:shadow-black/30 hover:ring-gray-100 hover:bg-brand/80"
    : variant.includes("red")
    ? "bg-red-600 text-white hover:shadow-md hover:shadow-black/30 hover:ring-gray-100 hover:bg-red-600/80"
    : "bg-transparent text-black ring-1 ring-black hover:shadow-md hover:shadow-brand/30 hover:ring-brand hover:bg-gray-100";
  const widthClasses = variant.includes("fullWidth") ? "w-full" : "";

  const href = props.href;
  const isLink = !!href;
  const classes = `${baseClasses} ${primaryClasses} ${widthClasses} ${props.className} px-4 py-2 sm:px-5 sm:py-3 inline-flex items-center justify-center`;

  return isLink ? (
    <Link {...props} className={classes}>
      {children}
    </Link>
  ) : (
    <button {...props} className={classes}>
      {children}
    </button>
  );
}
