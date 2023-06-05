export interface RouteMeta {
  shouldShowInNav: boolean;
  navOrder?: number;
  m17n?: Array<{
    lang: string;
    title: string;
  }>;
}
