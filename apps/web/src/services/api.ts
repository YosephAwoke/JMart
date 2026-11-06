const configuredApiUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, '').replace(/\/api$/, '');

export function apiUrl(path: string) {
  return `${configuredApiUrl ?? ''}${path}`;
}
