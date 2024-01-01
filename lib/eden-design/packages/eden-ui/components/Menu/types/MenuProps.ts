export type IMenuRouteProps =
  | {
      path: string;
      operation?: "push" | "replace";
    }
  | {
      name: string;
      operation?: "push" | "replace";
    };

export type IMenuDataProps = {
  title: string;
  route?: IMenuRouteProps;
  children?: IMenuData[];
};

export type IMenuGroupDataProps = {
  groupName: string;
  route?: IMenuRouteProps;
  children: IMenuData[];
};

export type IMenuData = IMenuDataProps | IMenuGroupDataProps;
