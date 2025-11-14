let memberModal;
let references = { plans: [], sports: [] };
let filters = { search: '', sport: '', plan: '', status: '' };

const setAdminName = (user) => {
  document.getElementById('adminName').textContent = user.name || user.email;
};

const populateSelect = (select, items, key, value) => {
  select.innerHTML = '<option value="">All</option>';
  items.forEach((item) => {
    const option = document.createElement('option');
    option.value = item[key];
    option.textContent = item[value];
    select.appendChild(option);
  });
};

const populateReferenceSelects = () => {
  populateSelect(document.getElementById('sportFilter'), references.sports, 'sport_id', 'sport_name');
  populateSelect(document.getElementById('planFilter'), references.plans, 'plan_id', 'plan_name');

  const sportSelect = document.getElementById('memberSport');
  sportSelect.innerHTML = '<option value="">Select sport</option>';
  references.sports.forEach((sport) => {
    const option = document.createElement('option');
    option.value = sport.sport_id;
    option.textContent = sport.sport_name;
    sportSelect.appendChild(option);
  });

  const planSelect = document.getElementById('memberPlan');
  planSelect.innerHTML = '<option value="">Select plan</option>';
  references.plans.forEach((plan) => {
    const option = document.createElement('option');
    option.value = plan.plan_id;
    option.textContent = `${plan.plan_name} (${plan.duration_months}m)`;
    planSelect.appendChild(option);
  });
};

const loadReferences = async () => {
  references = await FitSphereAPI.authRequest('/members/references');
  populateReferenceSelects();
};

const renderMembers = (members) => {
  const tbody = document.querySelector('#membersTable tbody');
  const empty = document.getElementById('membersEmpty');
  if (!members.length) {
    tbody.innerHTML = '';
    empty.textContent = 'No members found.';
    empty.classList.remove('d-none');
    return;
  }
  empty.classList.add('d-none');

  tbody.innerHTML = members
    .map((member) => {
      const statusBadge = member.latest_payment_status === 'Paid' ? 'badge-paid' : 'badge-pending';
      const expiryChip = member.is_expiring_soon
        ? '<span class="badge bg-warning text-dark ms-2">Expiring soon</span>'
        : '';
      return `
        <tr>
          <td>
            <div class="fw-bold">${member.name}</div>
            <small class="text-muted">${member.phone || ''}</small>
          </td>
          <td>${member.sport_name || '-'}</td>
          <td>${member.plan_name || '-'}<br/><small class="text-muted">${FitSphereAPI.formatCurrency(member.price)}</small></td>
          <td>${member.expiry_date || '-'} ${expiryChip}</td>
          <td><span class="badge-status ${statusBadge}">${member.latest_payment_status}</span></td>
          <td class="text-end">
            <div class="card-action justify-content-end">
              <a class="btn btn-sm btn-outline-secondary" href="/admin/member-profile?id=${member.member_id}">View</a>
              <button class="btn btn-sm btn-outline-primary" data-action="edit" data-id="${member.member_id}">Edit</button>
              <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${member.member_id}">Delete</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');
};

const buildQuery = () => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  return params.toString();
};

const loadMembers = async () => {
  const empty = document.getElementById('membersEmpty');
  empty.textContent = 'Loading...';
  empty.classList.remove('d-none');
  try {
    const query = buildQuery();
    const url = query ? `/members?${query}` : '/members';
    const members = await FitSphereAPI.authRequest(url);
    renderMembers(members);
  } catch (error) {
    console.error('Failed to load members', error);
    document.getElementById('membersTable').querySelector('tbody').innerHTML = '';
    empty.textContent = 'Failed to load members.';
  }
};

const openMemberModal = (member) => {
  document.getElementById('memberModalLabel').textContent = member ? 'Edit Member' : 'Add Member';
  document.getElementById('memberId').value = member?.member_id || '';
  document.getElementById('memberName').value = member?.name || '';
  document.getElementById('memberAge').value = member?.age || '';
  document.getElementById('memberGender').value = member?.gender || '';
  document.getElementById('memberPhone').value = member?.phone || '';
  document.getElementById('memberAddress').value = member?.address || '';
  document.getElementById('memberSport').value = member?.sport_id || '';
  document.getElementById('memberPlan').value = member?.plan_id || '';
  document.getElementById('memberJoinDate').value = member?.join_date || '';
  document.getElementById('memberError').classList.add('d-none');
  memberModal.show();
};

const handleMemberSubmit = async (event) => {
  event.preventDefault();
  const errorEl = document.getElementById('memberError');
  errorEl.classList.add('d-none');
  const memberId = document.getElementById('memberId').value;
  const payload = {
    name: document.getElementById('memberName').value.trim(),
    age: document.getElementById('memberAge').value ? Number(document.getElementById('memberAge').value) : null,
    gender: document.getElementById('memberGender').value,
    phone: document.getElementById('memberPhone').value.trim(),
    address: document.getElementById('memberAddress').value.trim(),
    sport_id: Number(document.getElementById('memberSport').value),
    plan_id: Number(document.getElementById('memberPlan').value),
    join_date: document.getElementById('memberJoinDate').value || null,
  };

  try {
    if (memberId) {
      await FitSphereAPI.authRequest(`/members/${memberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      await FitSphereAPI.authRequest('/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }
    memberModal.hide();
    await loadMembers();
  } catch (error) {
    errorEl.textContent = error.message;
    errorEl.classList.remove('d-none');
  }
};

const handleMemberActions = async (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const id = button.dataset.id;

  if (button.dataset.action === 'edit') {
    try {
      const member = await FitSphereAPI.authRequest(`/members/${id}`);
      openMemberModal(member);
    } catch (error) {
      console.error('Failed to load member', error);
    }
  }

  if (button.dataset.action === 'delete') {
    if (confirm('Delete this member?')) {
      try {
        await FitSphereAPI.authRequest(`/members/${id}`, { method: 'DELETE' });
        await loadMembers();
      } catch (error) {
        alert(error.message);
      }
    }
  }
};

const initFilters = () => {
  document.getElementById('memberFilters').addEventListener('submit', (event) => {
    event.preventDefault();
    filters = {
      search: document.getElementById('searchInput').value.trim(),
      sport: document.getElementById('sportFilter').value,
      plan: document.getElementById('planFilter').value,
      status: document.getElementById('statusFilter').value,
    };
    loadMembers();
  });
};

document.addEventListener('DOMContentLoaded', async () => {
  memberModal = new bootstrap.Modal(document.getElementById('memberModal'));
  const user = await FitSphereAPI.ensureAdmin();
  setAdminName(user);
  await loadReferences();
  await loadMembers();

  document.getElementById('memberForm').addEventListener('submit', handleMemberSubmit);
  document.querySelector('#membersTable tbody').addEventListener('click', handleMemberActions);
  initFilters();
});
