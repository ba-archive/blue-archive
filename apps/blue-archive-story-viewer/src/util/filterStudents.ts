import { distance } from 'fastest-levenshtein';
import { AppliedFilter } from '../types/AppliedFilter';
import { Student, StudentAttributes, StudentNames } from '../types/Student';

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
    .replaceAll(specialCharacters, '');
  const lowercaseStudentNamesList = filteredNameList?.map(name => {
    return name.toString().toLowerCase().replaceAll(specialCharacters, '');
  });
  lowercaseStudentNamesList?.forEach(studentName => {
    if (studentName) {
      if (
        similarity(lowerCaseSearchString, studentName) > 0.66 ||
        lowerCaseSearchString.includes(studentName) ||
        studentName.includes(lowerCaseSearchString) ||
        studentName.startsWith(lowerCaseSearchString) ||
        studentName.endsWith(lowerCaseSearchString) ||
        '' === lowerCaseSearchString
      ) {
        found = true;
      }
    }
  });
  return found;
}

function filterStudentsByProperty(
  property: string,
  criteria: (string | number)[],
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
    '' === appliedFilters.searchString &&
    0 === appliedFilters.rarity.length &&
    0 === appliedFilters.club.length &&
    0 === appliedFilters.affiliation.length &&
    0 === appliedFilters.type.length &&
    0 === appliedFilters.armorType.length &&
    appliedFilters.bulletType &&
    0 === appliedFilters.bulletType.length
  ) {
    return studentsList.map(student => student.id);
  }
  let result = studentsList;
  if (appliedFilters.searchString) {
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
  }
  if (0 !== appliedFilters.rarity.length) {
    result = filterStudentsByProperty('rarity', appliedFilters.rarity, result);
  }
  if (0 !== appliedFilters.club.length) {
    result = filterStudentsByProperty('club', appliedFilters.club, result);
  }
  if (0 !== appliedFilters.affiliation.length) {
    result = filterStudentsByProperty(
      'affiliation',
      appliedFilters.affiliation,
      result
    );
  }
  if (0 !== appliedFilters.type.length) {
    result = filterStudentsByProperty('type', appliedFilters.type, result);
  }
  if (0 !== appliedFilters.armorType.length) {
    result = filterStudentsByProperty(
      'armorType',
      appliedFilters.armorType,
      result
    );
  }
  if (appliedFilters.bulletType && 0 !== appliedFilters.bulletType.length) {
    result = filterStudentsByProperty(
      'bulletType',
      appliedFilters.bulletType,
      result
    );
  }

  return result.map(student => student.id);
}

export { filterStudents };
