type OptionType = {
  value: string;
  label: string;
};

function CustomSelect({
  onChange = () => {},
  value = "",
  options,
  className = "",
  label = "Select",
}: {
  label?: string;
  className?: string;
  value: string | undefined;
  onChange?: (newVal: string | undefined) => void;
  options: OptionType[];
}) {
  if (options.length === 0)
    return (
      <select className="peer bg-transparent w-full border-none outline-none  peer ">
        <option value="" disabled>
          No options
        </option>
      </select>
    );
  return (
    <div className={`relative  min-w-[8rem] p-2 ${className}`}>
      <select
        className={`peer bg-transparent w-full border-none outline-none  ${
          value ? "" : "text-blue-gray-500 focus:text-inherit"
        } `}
        value={value || "Select"}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      >
        <option value="" disabled>
          Select
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div
        className=" 
         peer-focus:border-blue-500 peer-focus:border-2 peer-focus:border-t-0 transition-colors
        absolute top-0 right-0 pointer-events-none w-full h-full border-t-0 border border-blue-gray-500/30 rounded-md"
      ></div>
      <div className="absolute top-0 right-0 pointer-events-none w-full h-full flex gap-1 peer-focus:[&>*.side]:border-blue-500 text-blue-gray-500 peer-focus:text-blue-500 peer-focus:[&>*.side]:border-t-2 [&>*]:transition-colors">
        <span className="w-2 h-full border-blue-gray-500/30 border-t border-l rounded-s-md side"></span>
        <span className="label relative  h-fit -top-1/4 text-xs ">{label}</span>
        <span className="w-6 h-full flex-1 border-blue-gray-500/30 border-t border-r rounded-e-md side"></span>
      </div>
    </div>
  );
}

export default CustomSelect;
