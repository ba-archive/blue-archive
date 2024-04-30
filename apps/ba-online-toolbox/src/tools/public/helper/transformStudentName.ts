import { Student } from "../../../../../blue-archive-story-viewer/src/types/Student";

function transformStudentName(input: string, studentNames: Student[]) {
  const regex = /_[^_]+_/g;
  return input.replaceAll(regex, match => {
    const student = studentNames.find(
      student => student.name.jp === match.slice(1, -1)
    );
    return student ? student.name.cn : match;
  });
}

export { transformStudentName };
