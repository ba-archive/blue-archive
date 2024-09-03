export function isNumber(maybeNumber: any) {
  return (
    (typeof maybeNumber === "number" ||
      (typeof maybeNumber === "string" && maybeNumber.trim() !== "")) &&
    !isNaN(maybeNumber as number)
  );
}
