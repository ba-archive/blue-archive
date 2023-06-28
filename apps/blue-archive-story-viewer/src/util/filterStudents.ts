import { distance } from "fastest-levenshtein";
import { AppliedFilter } from "@types/AppliedFilter";
import { Student, StudentAttributes, StudentNames } from "@types/Student";

function similarity(s1: string, s2: string): number {
  return 1 - distance(s1, s2) / Math.max(s1.length, s2.length);
}

function isPossibleName(
  searchString: string,
  studentNamesList: (string | number)[] | undefined
): boolean {
  const filteredNameList = studentNamesList?.filter(res => {
    return res !== undefined;
  });
  let found = false;
  const specialCharacters = new RegExp(
    /[，。！“”/《》？：；「」{}｜\\"$&+,:;=?@#|'<>.^*()%!\-\s]/g
  );
  const lowerCaseSearchString = searchString
    .toLowerCase()
    .replaceAll(specialCharacters, "");
  const lowercaseStudentNamesList = filteredNameList?.map(name => {
    return name.toString().toLowerCase().replaceAll(specialCharacters, "");
  });
  lowercaseStudentNamesList?.forEach(studentName => {
    if (studentName) {
      if (
        similarity(lowerCaseSearchString, studentName) > 0.66 ||
        lowerCaseSearchString.includes(studentName) ||
        studentName.includes(lowerCaseSearchString) ||
        studentName.startsWith(lowerCaseSearchString) ||
        studentName.endsWith(lowerCaseSearchString) ||
        "" === lowerCaseSearchString
      ) {
        found = true;
      }
    }
  });
  return found;
}

function filterStudentsByProperty(
  property: string,
  criteria:
    | string
    | ("Pierce" | "Explode" | "Mystic")[]
    | undefined
    | string[]
    | ("LightArmor" | "HeavyArmor" | "Unarmed")[]
    | ("Striker" | "Special")[]
    | number[],
  initialList: Student[]
): Student[] {
  return initialList.filter((student: Student) =>
    criteria.includes(
      student[property as keyof StudentAttributes] as string | number
    )
  );
}

function filterStudents(
  appliedFilters: AppliedFilter,
  studentsNameList: StudentNames[],
  studentsList: Student[]
): number[] {
  if (
    Object.values(appliedFilters).every(
      (filter: (string | number)[]) => 0 === filter.length
    )
  ) {
    return studentsList.map(student => student.id);
  }

  let result = studentsList;
  for (const key in appliedFilters) {
    if ("searchString" === key) {
      const listFilteredByString: Student[] = [];
      studentsList.forEach(student => {
        if (
          isPossibleName(
            appliedFilters.searchString,
            studentsNameList.find(s => s.id === student.id)?.allNames
          )
        ) {
          listFilteredByString.push(student);
        }
      });
      result = listFilteredByString;
    } else {
      if (0 !== appliedFilters[key as keyof AppliedFilter].length) {
        result = filterStudentsByProperty(
          key,
          appliedFilters[key as keyof AppliedFilter],
          result
        );
      }
    }
  }

  return result.map(student => student.id);
}

export { filterStudents };
