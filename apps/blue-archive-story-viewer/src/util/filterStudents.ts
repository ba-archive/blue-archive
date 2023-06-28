import { distance } from "fastest-levenshtein";
import { match } from "pinyin-pro";
import { AppliedFilter } from "@types/AppliedFilter";
import { Student, StudentAttributes, StudentNames } from "@types/Student";

const specialCharacters = new RegExp(
  /[，。！“”/《》？：；「」{}｜\\"$&+,:;=?@#|'<>.^*()（）%!~～`_\[\]\-\s]/g
);

function similarity(s1: string, s2: string): number {
  return 1 - distance(s1, s2) / Math.max(s1.length, s2.length);
}

function findPinyin(searchString: string, studentName: string) {
  const studentNameWithoutSpecialCharacters = studentName.replaceAll(
    specialCharacters,
    ""
  );
  // only allow pinyin search if the studentName is in Chinese
  if (
    studentName.match(/^[\u4e00-\u9fa5]+$/) &&
    searchString.match(/^[a-zA-Z]+$/)
  ) {
    const targetPinyin = match(
      studentNameWithoutSpecialCharacters,
      searchString,
      { precision: "any" }
    );
    if (null !== targetPinyin) {
      return true;
    }
  }
  return false;
}

function isPossibleName(
  searchString: string,
  studentNamesList: (string | number)[] | undefined
): boolean {
  const filteredNameList = studentNamesList?.filter(res => {
    return res !== undefined;
  });
  let found = false;
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
        findPinyin(lowerCaseSearchString, studentName)
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
