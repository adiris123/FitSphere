const FitSphereAPI = (() => {
  const STORAGE_KEY = 'fitsphere_session';

  const getSession = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (error) {
      return {};
    }
  };

  const setSession = (session) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  };

  const clearSession = () => localStorage.removeItem(STORAGE_KEY);

  const getToken = () => getSession().token;
  const getUser = () => getSession().user;

  const setAuth = ({ token, user }) => {
    setSession({ token, user, timestamp: Date.now() });
  };

  const request = async (url, options = {}) => {
    const response = await fetch(url, options);
    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || 'Request failed');
    }
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return response.json();
    }
    return response.text();
  };

  const authRequest = async (url, options = {}) => {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };
    return request(url, { ...options, headers });
  };

  const ensureAdmin = async () => {
    try {
      const user = await authRequest('/auth/me');
      if (user.role !== 'admin') {
        throw new Error('Admin privileges required');
      }
      setAuth({ token: getToken(), user });
      return user;
    } catch (error) {
      clearSession();
      window.location.href = '/login';
      throw error;
    }
  };

  const formatCurrency = (value) => `$${Number(value || 0).toFixed(2)}`;
  const formatDate = (value) =>
    value ? new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '-';

  return {
    getToken,
    getUser,
    setAuth,
    clearSession,
    request,
    authRequest,
    ensureAdmin,
    formatCurrency,
    formatDate,
  };
})();

const handleLogout = () => {
  FitSphereAPI.clearSession();
  window.location.href = '/login';
};
