export default function RecipeOverviewChip({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  const transformValue = (val: string | number) => {
    if (typeof val === "number") {
      return val;
    }
    return val
      .replace(/\s*hours?/g, "h")
      .replace(/\s*minutes?/g, "m")
      .replace(/\s+/g, " ")
      .trim();
  };

  return (
    <div className="bg-background border-b-2 border-black flex flex-col pt-3 pb-3 flex flex-col gap-1 w-full">
      <p className="text-foreground/50 text-xs">{label}</p>
      <p className="text-lg text-foreground font-bold">
        {transformValue(value)}
      </p>
    </div>
  );
}
