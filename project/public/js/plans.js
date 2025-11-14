let planModal;

const loadPlans = async () => {
  const tableBody = document.querySelector('#plansTable tbody');
  const emptyState = document.getElementById('plansEmpty');
  try {
    const plans = await FitSphereAPI.request('/plans');
    if (!plans.length) {
      tableBody.innerHTML = '';
      emptyState.textContent = 'No plans defined yet.';
      emptyState.classList.remove('d-none');
      return;
    }
    emptyState.classList.add('d-none');
    tableBody.innerHTML = plans
      .map(
        (plan) => `
          <tr>
            <td>${plan.plan_name}</td>
            <td>${plan.duration_months}</td>
            <td>${FitSphereAPI.formatCurrency(plan.price)}</td>
            <td class="text-end">
              <div class="card-action justify-content-end">
                <button class="btn btn-sm btn-outline-primary" data-action="edit" data-id="${plan.plan_id}">Edit</button>
                <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${plan.plan_id}">Delete</button>
              </div>
            </td>
          </tr>
        `
      )
      .join('');
  } catch (error) {
    console.error('Failed to load plans', error);
    emptyState.textContent = 'Failed to load plans.';
    emptyState.classList.remove('d-none');
  }
};

const openPlanModal = (plan) => {
  document.getElementById('planModalLabel').textContent = plan ? 'Edit Plan' : 'Add Plan';
  document.getElementById('planId').value = plan?.plan_id || '';
  document.getElementById('planName').value = plan?.plan_name || '';
  document.getElementById('planDuration').value = plan?.duration_months || '';
  document.getElementById('planPrice').value = plan?.price || '';
  document.getElementById('planError').classList.add('d-none');
  planModal.show();
};

const handlePlanSubmit = async (event) => {
  event.preventDefault();
  const errorEl = document.getElementById('planError');
  errorEl.classList.add('d-none');
  const planId = document.getElementById('planId').value;
  const payload = {
    plan_name: document.getElementById('planName').value.trim(),
    duration_months: Number(document.getElementById('planDuration').value),
    price: Number(document.getElementById('planPrice').value),
  };

  try {
    if (planId) {
      await FitSphereAPI.authRequest(`/plans/${planId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      await FitSphereAPI.authRequest('/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }
    planModal.hide();
    await loadPlans();
  } catch (error) {
    errorEl.textContent = error.message;
    errorEl.classList.remove('d-none');
  }
};

const handlePlanActions = async (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const id = button.dataset.id;

  if (button.dataset.action === 'edit') {
    try {
      const plans = await FitSphereAPI.request('/plans');
      const plan = plans.find((item) => item.plan_id === Number(id));
      if (plan) openPlanModal(plan);
    } catch (error) {
      console.error('Failed to load plan', error);
    }
  }

  if (button.dataset.action === 'delete') {
    if (confirm('Delete this plan?')) {
      try {
        await FitSphereAPI.authRequest(`/plans/${id}`, { method: 'DELETE' });
        await loadPlans();
      } catch (error) {
        alert(error.message);
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  planModal = new bootstrap.Modal(document.getElementById('planModal'));
  const user = await FitSphereAPI.ensureAdmin();
  document.getElementById('adminName').textContent = user.name || user.email;
  loadPlans();

  document.getElementById('planForm').addEventListener('submit', handlePlanSubmit);
  document.querySelector('#plansTable tbody').addEventListener('click', handlePlanActions);
});
