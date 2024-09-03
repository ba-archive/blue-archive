export function isNumber(maybeNumber: any) {
  return (
    (typeof maybeNumber === "number" ||
      (typeof maybeNumber === "string" && maybeNumber.trim() !== "")) &&
    !isNaN(maybeNumber as number)
  );
}

export function toNumber(maybeNumber: any) {
  if (isNumber(maybeNumber)) {
    return Number(maybeNumber);
  } else if (typeof maybeNumber === "string") {
    return Number(maybeNumber.trim());
  }
  return 0;
}
