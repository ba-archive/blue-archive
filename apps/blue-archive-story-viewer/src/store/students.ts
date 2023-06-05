import { defineStore } from 'pinia';
import { Student } from '../types/Student';

export const useStudentStore = defineStore({
  id: 'ba-students-storage',
  state: () => {
    return {
      students: [] as Student[],
    };
  },
  persist: false,
  getters: {
    getAllStudents: state => {
      return state.students;
    },
    getStudentById: state => (id: number) =>
      state.students.find(student => student.id === id),
    getStudentAvatar: () => (CharacterId: number) =>
      `/image/avatar_students/${CharacterId}.webp`,
  },
  actions: {
    setStudents(students: Student[]) {
      this.students = students;
    },
  },
});
