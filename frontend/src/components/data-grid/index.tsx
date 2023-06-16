/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo } from "react";
import Provider, { useProvider } from "../provider";
import { stringify } from "../../utils/functions";

type Row = Record<string, unknown>;

export type Column<T extends Row = Row> = {
  header: string | React.ReactNode;
  field?: string;
  className?: string;
  style?: React.CSSProperties;
  width?: string;
  show?: boolean;
  valueGetter?: (row: T) => React.ReactNode;
};

interface DataGridProps<T extends Row>
  extends React.HTMLAttributes<HTMLDivElement> {
  rows: T[];
  columns: Column<T>[];
  headerClassName?: string;
  headerStyle?: React.CSSProperties;
  bodyClassName?: string;
  bodyStyle?: React.CSSProperties;
  rowClassName?: string;
  rowStyle?: React.CSSProperties;
  loading?: boolean;
  error?: boolean;
  cellMinWidth?: number;
}
type DataGridContext = DataGridProps<Row> & {
  filterdColumns: Column[];
  restColumns: Column[];
};

function Row({ row }: { row: Row }) {
  const { filterdColumns, restColumns, ...props } =
    useProvider<DataGridContext>();
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <tr
        className={props.rowClassName}
        onClick={() => restColumns.length > 0 && setOpen(!open)}
        style={{
          ...props.rowStyle,
          cursor: restColumns.length > 0 ? "pointer" : "default",
        }}
      >
        {filterdColumns.map((column, index) => {
          const value = column.valueGetter ? (
            column.valueGetter(row)
          ) : (
            <span>{stringify(row[column.field || ""]) || "- - -"} </span>
          );
          return (
            <td key={index} className={column.className} style={column.style}>
              {value}
            </td>
          );
        })}
      </tr>
      {restColumns.length > 0 && (
        <tr>
          <td colSpan={filterdColumns.length}>
            <div
              style={{
                maxHeight: open ? restColumns.length * 40 : 0,
                padding: open ? "0.5rem 0.5rem " : "0 0.5rem",
                overflow: "hidden",
              }}
              className="grid grid-cols-2  bg-light dark:bg-primary-dark px-2 sm:px-3 md:px-4 gap-x-2 gap-y-3 transition-[padding,max-height] duration-300 ease-in-out"
            >
              {restColumns.map((column, index) => (
                <React.Fragment key={index}>
                  <span>{column.header}</span>
                  <span>
                    {column.valueGetter ? (
                      column.valueGetter(row)
                    ) : (
                      <span>
                        {stringify(row[column.field || ""]) || "- - -"}{" "}
                      </span>
                    )}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function DataGrid<T extends Row>({
  cellMinWidth = 200,
  ...props
}: DataGridProps<T>) {
  const [innerWidth, setInnerWidth] = React.useState(window.innerWidth);
  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
    };
    window.addEventListener("resize", resizeListener);
    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, []);

  const max = useMemo(() => {
    if (innerWidth < 480) return 1;
    if (innerWidth < 640) return 2;
    return Math.floor(innerWidth / cellMinWidth);
  }, [innerWidth]);

  const filterdColumns = useMemo(() => {
    return props.columns
      .filter((column) => column.show !== false)
      .slice(0, max);
  }, [props.columns, max]);

  const restColumns = useMemo(() => {
    return props.columns.filter((column) => column.show !== false).slice(max);
  }, [props.columns, max]);

  return (
    <Provider
      value={{
        ...props,
        filterdColumns,
        restColumns,
      }}
    >
      <table className={props.className}>
        <thead>
          <tr className={props.headerClassName} style={props.headerStyle}>
            {filterdColumns.map((column, index) => (
              <th
                key={index}
                className={column.className}
                style={{
                  width: column.width,
                  ...column.style,
                }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`${props.bodyClassName} `} style={props.bodyStyle}>
          {props.error && (
            <tr>
              <td colSpan={filterdColumns.length}>
                <div className="flex flex-col items-center py-4 gap-4">
                  <img
                    src="/data-grid-error.svg"
                    className="w-1/2 min-h-[20rem] h-[50vh]"
                  />
                  <div className="text-center">
                    <b>Something went wrong!</b>
                    <div className="text-sm">
                      Please try again after sometime
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          )}
          {!props.error &&
            props.loading &&
            Array.from({ length: 6 }).map((_, index) => (
              <tr key={index} className={props.rowClassName}>
                {filterdColumns.map((column, index) => (
                  <td key={index} style={column.style}>
                    <div className="animate-pulse  !bg-gray-500  mx-1 rounded h-10 my-1"></div>
                  </td>
                ))}
              </tr>
            ))}
          {!props.error &&
            !props.loading &&
            props.rows.map((row, index) => <Row key={index} row={row} />)}
          {!props.error && !props.loading && props.rows.length === 0 && (
            <tr>
              <td colSpan={filterdColumns.length}>
                <div className="w-full h-[60vh] flex gap-4 flex-col justify-center items-center">
                  <img src="/data-grid-empty.svg" className="h-3/5 w-1/2" />
                  <div className="text-center">
                    <b>No Data Found</b>
                    <div className="text-sm">
                      Please try again after sometime
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Provider>
  );
}

export default DataGrid;
