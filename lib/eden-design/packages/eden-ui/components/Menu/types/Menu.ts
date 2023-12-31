export interface IMenuData {
    title: string;
    route: {
      prop: string,
      type: 'path' | 'name',
      operation: 'push' | 'replace'
    };
    children?: IMenuData[];
}