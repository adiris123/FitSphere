const params = new URLSearchParams(window.location.search);
const memberId = params.get('id');

const setAdminName = (user) => {
  document.getElementById('adminName').textContent = user.name || user.email;
};

const renderMemberDetails = (member) => {
  document.getElementById('memberName').textContent = member.name;
  document.getElementById('detailName').textContent = member.name;
  document.getElementById('detailAge').textContent = member.age || '-';
  document.getElementById('detailGender').textContent = member.gender || '-';
  document.getElementById('detailPhone').textContent = member.phone || '-';
  document.getElementById('detailAddress').textContent = member.address || '-';
  document.getElementById('detailJoin').textContent = FitSphereAPI.formatDate(member.join_date);
  document.getElementById('detailExpiry').textContent = FitSphereAPI.formatDate(member.expiry_date);
  document.getElementById('detailSport').textContent = member.sport_name || '-';
  document.getElementById('detailPlan').textContent = member.plan_name || '-';
  document.getElementById('detailDuration').textContent = member.duration_months ? `${member.duration_months} months` : '-';
  document.getElementById('detailPrice').textContent = FitSphereAPI.formatCurrency(member.price);
  document.getElementById('daysUntilExpiry').textContent =
    typeof member.days_until_expiry === 'number' ? member.days_until_expiry : '-';

  const warning = document.getElementById('expiryWarning');
  if (member.is_expiring_soon) {
    warning.classList.remove('d-none');
  } else {
    warning.classList.add('d-none');
  }
};

const renderPaymentHistory = (payments) => {
  const tbody = document.querySelector('#paymentHistory tbody');
  const empty = document.getElementById('paymentsEmpty');
  if (!payments.length) {
    tbody.innerHTML = '';
    empty.classList.remove('d-none');
    return;
  }
  empty.classList.add('d-none');
  tbody.innerHTML = payments
    .map(
      (payment) => `
        <tr>
          <td>${FitSphereAPI.formatCurrency(payment.amount)}</td>
          <td>${payment.status}</td>
          <td>${FitSphereAPI.formatDate(payment.date)}</td>
        </tr>
      `
    )
    .join('');
};

const loadMemberProfile = async () => {
  if (!memberId) {
    window.location.href = '/admin/members';
    return;
  }
  try {
    const member = await FitSphereAPI.authRequest(`/members/${memberId}`);
    renderMemberDetails(member);
    renderPaymentHistory(member.payments || []);
  } catch (error) {
    console.error('Failed to load member profile', error);
  }
};

const handleDownloadCard = async () => {
  try {
    const card = document.getElementById('profileCard');
    const canvas = await html2canvas(card, { backgroundColor: '#ffffff', scale: 2 });
    const imageData = canvas.toDataURL('image/png');
    const pdf = new jspdf.jsPDF('landscape', 'pt', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
    const width = canvas.width * ratio;
    const height = canvas.height * ratio;
    const x = (pageWidth - width) / 2;
    const y = (pageHeight - height) / 2;
    pdf.addImage(imageData, 'PNG', x, y, width, height);
    pdf.save(`membership-card-${memberId}.pdf`);
  } catch (error) {
    console.error('Failed to export PDF', error);
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  const user = await FitSphereAPI.ensureAdmin();
  setAdminName(user);
  await loadMemberProfile();
  document.getElementById('downloadCard').addEventListener('click', handleDownloadCard);
});
