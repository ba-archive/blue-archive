export type Library = Array<{
  type: string;
  contents: LibraryObject[];
}>;

export interface LibraryObject {
  title: string;
  avatar: string;
  description: string;
  link: string;
}
