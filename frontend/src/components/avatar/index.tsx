import { useState } from "react";

interface AppProps extends React.HTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
}
function Avatar({
  src,
  alt = "firstName lastName",
  className,
  ...props
}: AppProps) {
  const [error, setError] = useState(false);
  const FirstLetter = alt.split(" ")[0][0]?.toUpperCase();
  if (src && !error)
    return (
      <img
        {...props}
        className={`aspect-square rounded-full ${className}`}
        onError={(e) => {
          setError(true);
        }}
      />
    );
  else
    return (
      <div
        className={`flex justify-center items-center aspect-square bg-blue-500 text-white brightness-110 rounded-full  ${className}`}
      >
        <span>{FirstLetter}</span>
      </div>
    );
}

export default Avatar;
