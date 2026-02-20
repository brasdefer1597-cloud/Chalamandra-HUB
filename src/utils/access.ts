const COOKIE_KEY = 'chalamandra_admin';

const getTopLevelDomain = () => {
  const host = window.location.hostname;
  const parts = host.split('.');
  if (parts.length >= 2) {
    return `.${parts.slice(-2).join('.')}`;
  }
  return host;
};

export const getCookie = (name: string) => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
};

export const setAdminCookie = () => {
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
  const domain = getTopLevelDomain();
  document.cookie = `${COOKIE_KEY}=true; expires=${expires}; path=/; SameSite=Lax; domain=${domain}`;
  localStorage.setItem('pudin_access', 'true');
};

export const isAdminActive = () => getCookie(COOKIE_KEY) === 'true' || localStorage.getItem('pudin_access') === 'true';

export const syncPudinFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('access') === 'pudin') {
    setAdminCookie();
    return true;
  }
  return isAdminActive();
};
