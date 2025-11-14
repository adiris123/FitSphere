let sportModal;

const loadSports = async () => {
  const tableBody = document.querySelector('#sportsTable tbody');
  const emptyState = document.getElementById('sportsEmpty');
  try {
    const sports = await FitSphereAPI.request('/sports');
    if (!sports.length) {
      tableBody.innerHTML = '';
      emptyState.textContent = 'No sports created yet.';
      emptyState.classList.remove('d-none');
      return;
    }
    emptyState.classList.add('d-none');
    tableBody.innerHTML = sports
      .map(
        (sport) => `
          <tr>
            <td>${sport.sport_name}</td>
            <td>${sport.description || '-'}</td>
            <td class="text-end">
              <div class="card-action justify-content-end">
                <button class="btn btn-sm btn-outline-primary" data-action="edit" data-id="${sport.sport_id}">Edit</button>
                <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${sport.sport_id}">Delete</button>
              </div>
            </td>
          </tr>
        `
      )
      .join('');
  } catch (error) {
    console.error('Failed to load sports', error);
    emptyState.textContent = 'Failed to load sports.';
    emptyState.classList.remove('d-none');
  }
};

const openModal = (sport) => {
  document.getElementById('sportModalLabel').textContent = sport ? 'Edit Sport' : 'Add Sport';
  document.getElementById('sportId').value = sport?.sport_id || '';
  document.getElementById('sportName').value = sport?.sport_name || '';
  document.getElementById('sportDescription').value = sport?.description || '';
  document.getElementById('sportError').classList.add('d-none');
  sportModal.show();
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const errorEl = document.getElementById('sportError');
  errorEl.classList.add('d-none');
  const sportId = document.getElementById('sportId').value;
  const payload = {
    sport_name: document.getElementById('sportName').value.trim(),
    description: document.getElementById('sportDescription').value.trim(),
  };

  try {
    if (sportId) {
      await FitSphereAPI.authRequest(`/sports/${sportId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      await FitSphereAPI.authRequest('/sports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }
    sportModal.hide();
    await loadSports();
  } catch (error) {
    errorEl.textContent = error.message;
    errorEl.classList.remove('d-none');
  }
};

const handleTableClick = async (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const id = button.dataset.id;
  if (button.dataset.action === 'edit') {
    try {
      const sports = await FitSphereAPI.request('/sports');
      const sport = sports.find((item) => item.sport_id === Number(id));
      if (sport) openModal(sport);
    } catch (error) {
      console.error('Failed to load sport', error);
    }
  }
  if (button.dataset.action === 'delete') {
    if (confirm('Delete this sport?')) {
      try {
        await FitSphereAPI.authRequest(`/sports/${id}`, { method: 'DELETE' });
        await loadSports();
      } catch (error) {
        alert(error.message);
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  sportModal = new bootstrap.Modal(document.getElementById('sportModal'));
  const user = await FitSphereAPI.ensureAdmin();
  document.getElementById('adminName').textContent = user.name || user.email;
  loadSports();

  document.getElementById('sportForm').addEventListener('submit', handleSubmit);
  document.querySelector('#sportsTable tbody').addEventListener('click', handleTableClick);
});
