export function switchTheme(theme: 'light' | 'dark') {
  const htmlElement = document.querySelector('html') as HTMLHtmlElement;
  const metaThemeColor = document.querySelector('meta[name=theme-color]');

  if ('light' === theme) {
    htmlElement.dataset.theme = 'light';
    metaThemeColor?.setAttribute('content', '#ffffffd8');
  } else {
    htmlElement.dataset.theme = 'dark';
    metaThemeColor?.setAttribute('content', '#343e50d8');
  }
}
