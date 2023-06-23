import { useState } from "react";
import For from "../for";
import Show from "../show";
// import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
// import { FiMoreHorizontal } from "react-icons/fi";

import "./index.scss";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import { Button, IconButton } from "@material-tailwind/react";
interface PaginationProps {
  total: number;
  offset?: number;
  value: {
    page: number;
    perPage: number;
  };
  className?: string;
  style?: React.CSSProperties;
  onChange?: (value: { page: number; perPage: number }) => void;
}

function Pagination({
  total,
  offset = 2,
  onChange,
  className,
  ...props
}: PaginationProps) {
  const [{ page, perPage }, setValue] = useState(
    props.value || { page: 1, perPage: 10 }
  );

  const max = Math.ceil(total / perPage);
  const pages = Array.from({ length: max }, (_, i) => i + 1);

  const showPages = pages.slice(
    Math.max(0, page - offset - 1),
    Math.min(page + offset, max)
  );

  const changePage = (p: number) => {
    if (page < 1 || page > max) return;
    setValue({ page: p, perPage });
    if (onChange) onChange({ page: p, perPage });
  };

  const changePerPage = (p: number) => {
    setValue({ page: 1, perPage: p });
    if (onChange) onChange({ page: 1, perPage: p });
  };

  return (
    <div className={`flex flex-wrap gap-1 lg:gap-2 items-center  ${className}`}>
      <span className="hidden lg:inline-block">Total {total} items</span>
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-2 rounded-full"
          disabled={page === 1}
          onClick={() => changePage(page - 1)}
        >
          <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
          <span className="hidden lg:inline-block">Previous</span>
        </Button>
        <div className="flex items-center gap-1">
          <Show when={page > offset + 1}>
            <IconButton
              className="rounded-full hidden sm:inline-block"
              onClick={() => changePage(1)}
              key={page}
              variant="text"
            >
              1
            </IconButton>
          </Show>
          <Show when={page > offset + 1}>
            <span className="hidden sm:inline-block">
              <EllipsisHorizontalIcon className="w-6 text-blue-500" />
            </span>
          </Show>
          <For each={showPages}>
            {(p) => (
              <IconButton
                className="rounded-full hidden md:inline-block"
                onClick={() => changePage(p)}
                key={page}
                variant={p === page ? "filled" : "text"}
              >
                {p}
              </IconButton>
            )}
          </For>
          <IconButton
            className="rounded-full inline-block md:hidden"
            variant="filled"
          >
            {page}
          </IconButton>
          <Show when={page < max - offset}>
            <span className="hidden sm:inline-block">
              <EllipsisHorizontalIcon className="w-6 text-blue-500" />
            </span>
          </Show>
          <Show when={page < max - offset}>
            <IconButton
              className="rounded-full hidden sm:inline-block"
              onClick={() => changePage(max)}
              variant="text"
            >
              {max}
            </IconButton>
          </Show>
        </div>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-2 rounded-full"
          onClick={() => changePage(page + 1)}
          disabled={!total || page === max}
        >
          <span className="hidden lg:inline-block">Next</span>
          <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
        </Button>
      </div>
      <select
        className="p-2 rounded bg-transparent hover:ring-blue-200 border-none outline-none ring ring-transparent focus:ring-blue-400 text-xs sm:text-base"
        onChange={(e) => changePerPage(Number(e.target.value))}
        value={perPage}
      >
        <option label="5 / page">5</option>
        <option label="10 / page">10</option>
        <option label="20 / page">20</option>
        <option label="50 / page">50</option>
      </select>
    </div>
  );
}

export default Pagination;
