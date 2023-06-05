export function resizeTextareas() {
  let textAreas = document.querySelectorAll("textarea");
  textAreas.forEach(value => {
    value.style.height = value.scrollHeight + "px";
  });
}
