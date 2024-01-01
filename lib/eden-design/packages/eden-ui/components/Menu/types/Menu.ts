export interface IMenuDataProps {
  route?:
    | {
        path: string;
        operation?: "push" | "replace";
      }
    | {
        name: string;
        operation?: "push" | "replace";
      };
  children?: IMenuData[];
}
export type IMenuData =
  | (IMenuDataProps & {
      title: string;
    })
  | (IMenuDataProps & {
      groupName: string;
    });
