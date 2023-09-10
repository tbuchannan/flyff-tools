interface InputProps {
  onChange: (number: number) => void;
  value: number;
}

export function ItemInput({ onChange, value }: InputProps) {
  return (
    <input
      className="border-0 focus:border-transparent w-8 text-center bg-black"
      value={value}
      onChange={(e) => {
        if (
          Number(e.currentTarget.value) >= 0 &&
          Number(e.currentTarget.value) <= 10
        )
          onChange(Number(e.currentTarget.value));
      }}
      type="number"
    />
  );
}
