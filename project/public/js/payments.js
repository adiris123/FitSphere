let paymentModal;
let memberOptions = [];

const setAdminName = (user) => {
  document.getElementById('adminName').textContent = user.name || user.email;
};

const populateMemberSelect = () => {
  const select = document.getElementById('paymentMember');
  select.innerHTML = '<option value="">Select member</option>';
  memberOptions.forEach((member) => {
    const option = document.createElement('option');
    option.value = member.member_id;
    option.textContent = `${member.name} (${member.sport_name || 'N/A'})`;
    select.appendChild(option);
  });
};

const loadMembersLookup = async () => {
  const members = await FitSphereAPI.authRequest('/members');
  memberOptions = members;
  populateMemberSelect();
};

const renderPayments = (payments) => {
  const tbody = document.querySelector('#paymentsTable tbody');
  const empty = document.getElementById('paymentsEmpty');
  if (!payments.length) {
    tbody.innerHTML = '';
    empty.textContent = 'No payments recorded yet.';
    empty.classList.remove('d-none');
    return;
  }
  empty.classList.add('d-none');
  tbody.innerHTML = payments
    .map((payment) => {
      const badgeClass = payment.status === 'Paid' ? 'badge-paid' : 'badge-pending';
      return `
        <tr>
          <td>
            <div class="fw-bold">${payment.member_name || '-'}</div>
            <small class="text-muted">ID: ${payment.member_id}</small>
          </td>
          <td>${FitSphereAPI.formatCurrency(payment.amount)}</td>
          <td><span class="badge-status ${badgeClass}">${payment.status}</span></td>
          <td>${payment.date ? new Date(payment.date).toLocaleDateString() : '-'}</td>
          <td class="text-end">
            <div class="card-action justify-content-end">
              <button class="btn btn-sm btn-outline-secondary" data-action="edit" data-id="${payment.payment_id}">Edit</button>
              ${payment.status === 'Pending'
                ? `<button class="btn btn-sm btn-outline-success" data-action="mark" data-id="${payment.payment_id}">Mark Paid</button>`
                : ''}
            </div>
          </td>
        </tr>
      `;
    })
    .join('');
};

const loadPayments = async () => {
  const empty = document.getElementById('paymentsEmpty');
  empty.textContent = 'Loading...';
  empty.classList.remove('d-none');
  try {
    const payments = await FitSphereAPI.authRequest('/payments');
    renderPayments(payments);
  } catch (error) {
    console.error('Failed to load payments', error);
    document.querySelector('#paymentsTable tbody').innerHTML = '';
    empty.textContent = 'Failed to load payments.';
  }
};

const openPaymentModal = (payment) => {
  document.getElementById('paymentModalLabel').textContent = payment ? 'Edit Payment' : 'Add Payment';
  document.getElementById('paymentId').value = payment?.payment_id || '';
  document.getElementById('paymentMember').value = payment?.member_id || '';
  document.getElementById('paymentAmount').value = payment?.amount || '';
  document.getElementById('paymentStatus').value = payment?.status || 'Paid';
  document.getElementById('paymentDate').value = payment?.date || '';
  document.getElementById('paymentError').classList.add('d-none');
  paymentModal.show();
};

const handlePaymentSubmit = async (event) => {
  event.preventDefault();
  const errorEl = document.getElementById('paymentError');
  errorEl.classList.add('d-none');
  const paymentId = document.getElementById('paymentId').value;
  const payload = {
    member_id: Number(document.getElementById('paymentMember').value),
    amount: Number(document.getElementById('paymentAmount').value),
    status: document.getElementById('paymentStatus').value,
    date: document.getElementById('paymentDate').value || null,
  };

  try {
    if (paymentId) {
      await FitSphereAPI.authRequest(`/payments/${paymentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      await FitSphereAPI.authRequest('/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }
    paymentModal.hide();
    await loadPayments();
  } catch (error) {
    errorEl.textContent = error.message;
    errorEl.classList.remove('d-none');
  }
};

const handlePaymentActions = async (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const id = button.dataset.id;

  if (button.dataset.action === 'edit') {
    try {
      const payments = await FitSphereAPI.authRequest('/payments');
      const payment = payments.find((item) => item.payment_id === Number(id));
      if (payment) openPaymentModal(payment);
    } catch (error) {
      console.error('Failed to load payment', error);
    }
  }

  if (button.dataset.action === 'mark') {
    try {
      await FitSphereAPI.authRequest(`/payments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Paid' }),
      });
      await loadPayments();
    } catch (error) {
      alert(error.message);
    }
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
  const user = await FitSphereAPI.ensureAdmin();
  setAdminName(user);
  await loadMembersLookup();
  await loadPayments();

  document.getElementById('paymentForm').addEventListener('submit', handlePaymentSubmit);
  document.querySelector('#paymentsTable tbody').addEventListener('click', handlePaymentActions);
});
