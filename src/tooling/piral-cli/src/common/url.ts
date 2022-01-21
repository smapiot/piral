export function normalizePublicUrl(url: string) {
  if (!url) {
    return '/';
  }

  if (!url.endsWith('/')) {
    url = `${url}/`;
  }

  if (!url.startsWith('/')) {
    url = `/${url}`;
  }

  return url;
}
