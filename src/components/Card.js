export function Card({ children }) {
  return <div className="border rounded-lg shadow-md">{children}</div>;
}

export function CardContent({ children, className }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

export const CardFooter = ({ className = "", children }) => {
  return <div className={`px-6 py-4 bg-gray-50 ${className}`}>{children}</div>;
};

export const CardHeader = ({ className = "", children }) => {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

export const CardTitle = ({ className = "", as = "h3", children }) => {
  const Component = as;
  return (
    <Component className={`text-lg font-semibold ${className}`}>
      {children}
    </Component>
  );
};
