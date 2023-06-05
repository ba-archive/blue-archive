export interface Contributor {
  name: string;
  role: string;
  avatar: string;
  link?: string;
}

export interface StudentObject {
  name: string;
  id: number;
}

export interface UpdateContent {
  type:
    | 'fix'
    | 'feat'
    | 'refact'
    | 'docs'
    | 'chore'
    | 'test'
    | 'student'
    | 'main';
  content?: string;
  students?: StudentObject[];
}

export interface UpdateLog {
  date: string;
  contents: UpdateContent[];
}
