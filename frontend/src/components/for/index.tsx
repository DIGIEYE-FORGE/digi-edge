import React from "react";

type ForProps<T = any> = {
  each: T[];
  children: (item: T, index: number) => React.ReactNode;
};

const For = <T extends any>({ each, children }: ForProps<T>) => {
  return (
    <>
      {each.map((item, index) => (
        <React.Fragment key={index}>
          {children(item, (index = index))}
        </React.Fragment>
      ))}
    </>
  );
};

export default For;
