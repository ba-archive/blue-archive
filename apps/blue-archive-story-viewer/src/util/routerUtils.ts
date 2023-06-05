import { RouteRecordRaw } from 'vue-router';
import { RouteMeta } from '../types/Routes';

export function getRouteTranslation(
  route: RouteRecordRaw,
  lang: string
): string {
  const routeMeta = route.meta as RouteMeta | undefined;
  if (routeMeta && routeMeta.m17n) {
    const m17n = routeMeta.m17n;
    if (m17n) {
      return (
        m17n.find(translation => lang === translation.lang)?.title ||
        (route.name as string)
      );
    }
  }
  return route.name as string;
}
