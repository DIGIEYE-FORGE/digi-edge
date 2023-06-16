import React from "react";

function ScreenIndicator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <span
      {...props}
      className={`flex after:content-['xs'] sm:after:content-['sm'] md:after:content-['md'] lg:after:content-['lg'] xl:after:content-['xl'] 2xl:after:content-['2xl'] ${className}`}
    ></span>
  );
}

export default ScreenIndicator;
