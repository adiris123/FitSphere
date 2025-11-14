const renderSports = (sports) => {
  const grid = document.getElementById('sportsGrid');
  if (!grid) return;
  if (!sports.length) {
    grid.innerHTML = '<div class="col-12 text-center text-muted">No sports added yet.</div>';
    return;
  }

  grid.innerHTML = sports
    .map(
      (sport) => `
        <div class="col-md-4">
          <div class="feature-card p-4 h-100 fade-in">
            <h3 class="h5 fw-bold mb-2">${sport.sport_name}</h3>
            <p class="text-muted mb-0">${sport.description || 'Stay tuned for more details.'}</p>
          </div>
        </div>
      `
    )
    .join('');
};

const renderPlans = (plans) => {
  const grid = document.getElementById('plansGrid');
  if (!grid) return;
  if (!plans.length) {
    grid.innerHTML = '<div class="col-12 text-center text-muted">No plans available yet.</div>';
    return;
  }

  grid.innerHTML = plans
    .map(
      (plan) => `
        <div class="col-md-4">
          <div class="feature-card p-4 h-100 fade-in">
            <h3 class="h5 fw-bold mb-2">${plan.plan_name}</h3>
            <p class="text-muted mb-1">${plan.duration_months} months access</p>
            <h4 class="fw-bold text-secondary">$${Number(plan.price).toFixed(2)}</h4>
          </div>
        </div>
      `
    )
    .join('');
};

const fetchPublicData = async () => {
  try {
    const [sportsRes, plansRes] = await Promise.all([fetch('/sports'), fetch('/plans')]);
    if (sportsRes.ok) {
      renderSports(await sportsRes.json());
    }
    if (plansRes.ok) {
      renderPlans(await plansRes.json());
    }
  } catch (error) {
    console.error('Failed to load public data', error);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
  fetchPublicData();
});
