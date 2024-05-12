import axios from "axios";

function getStudents() {
  return axios
    .get(
      `https://preview.blue-archive.io/config/json/students.json?t=${Math.floor(
        Date.now() / 1000
      )}`
    )
    .then(res => res.data)
    .catch(e => console.error(e));
}

export { getStudents };
