// Resolves a site-relative asset path against the deployed base path, so the
// same build works at "/" (local preview) and "/Birthday1/" (GitHub Pages).
const BASE = import.meta.env.BASE_URL || '/';

export function url(path) {
  return BASE.replace(/\/+$/, '') + '/' + String(path).replace(/^\/+/, '');
}

export default url;
