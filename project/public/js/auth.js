document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  if (!form) return;

  const errorEl = document.getElementById('loginError');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({ message: 'Login failed' }));
        throw new Error(payload.message || 'Login failed');
      }

      const data = await response.json();
      FitSphereAPI.setAuth({ token: data.token, user: data.user });
      window.location.href = '/admin/dashboard';
    } catch (error) {
      if (errorEl) {
        errorEl.textContent = error.message;
        errorEl.classList.remove('d-none');
      }
    }
  });
});
