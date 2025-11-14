const memberModel = require('../models/memberModel');
const planModel = require('../models/planModel');
const paymentModel = require('../models/paymentModel');
const sportModel = require('../models/sportModel');

const formatDate = (date) => {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().split('T')[0];
};

const calculateExpiry = (joinDate, durationMonths) => {
  if (!joinDate || !durationMonths) return null;
  const date = new Date(joinDate);
  if (Number.isNaN(date.getTime())) return null;
  date.setMonth(date.getMonth() + Number(durationMonths));
  return date;
};

const enrichMember = (member) => {
  if (!member) return member;
  const expiryDate = calculateExpiry(member.join_date, member.duration_months);
  const today = new Date();
  const daysUntilExpiry = expiryDate ? Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24)) : null;

  return {
    ...member,
    join_date: member.join_date ? formatDate(member.join_date) : null,
    expiry_date: expiryDate ? formatDate(expiryDate) : null,
    days_until_expiry: daysUntilExpiry,
    is_expiring_soon: typeof daysUntilExpiry === 'number' ? daysUntilExpiry <= 14 : false,
  };
};

const listMembers = async (req, res) => {
  try {
    const filters = {
      search: req.query.search || null,
      sportId: req.query.sport || null,
      planId: req.query.plan || null,
      paymentStatus: req.query.status || null,
    };

    const members = await memberModel.getMembers(filters);
    const enriched = members.map(enrichMember);
    return res.json(enriched);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch members', error: error.message });
  }
};

const getMember = async (req, res) => {
  try {
    const memberId = req.params.id;
    const member = await memberModel.getMemberById(memberId);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const payments = await paymentModel.getPaymentsByMember(memberId);

    return res.json({
      ...enrichMember(member),
      payments: payments.map((payment) => ({
        ...payment,
        date: payment.date ? formatDate(payment.date) : null,
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch member', error: error.message });
  }
};

const createMember = async (req, res) => {
  try {
    const { name, age, gender, phone, address, sport_id, plan_id, join_date } = req.body;

    if (!name || !sport_id || !plan_id) {
      return res.status(400).json({ message: 'Name, sport, and plan are required' });
    }

    const formattedJoinDate = formatDate(join_date) || formatDate(new Date());

    const createdMember = await memberModel.createMember({
      name,
      age,
      gender,
      phone,
      address,
      sport_id,
      plan_id,
      join_date: formattedJoinDate,
    });

    const fullMember = await memberModel.getMemberById(createdMember.member_id);
    return res.status(201).json(enrichMember(fullMember));
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create member', error: error.message });
  }
};

const updateMember = async (req, res) => {
  try {
    const memberId = req.params.id;
    const existing = await memberModel.getMemberById(memberId);
    if (!existing) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const { name, age, gender, phone, address, sport_id, plan_id, join_date } = req.body;

    const formattedJoinDate =
      formatDate(join_date) || formatDate(existing.join_date) || formatDate(new Date());

    await memberModel.updateMember(memberId, {
      name,
      age,
      gender,
      phone,
      address,
      sport_id,
      plan_id,
      join_date: formattedJoinDate,
    });

    const member = await memberModel.getMemberById(memberId);
    return res.json(enrichMember(member));
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update member', error: error.message });
  }
};

const deleteMember = async (req, res) => {
  try {
    const memberId = req.params.id;
    const deleted = await memberModel.deleteMember(memberId);
    if (!deleted) {
      return res.status(404).json({ message: 'Member not found' });
    }
    return res.json({ message: 'Member deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete member', error: error.message });
  }
};

const getPlansAndSports = async (req, res) => {
  try {
    const [plans, sports] = await Promise.all([planModel.getPlans(), sportModel.getSports()]);
    return res.json({ plans, sports });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch reference data', error: error.message });
  }
};

module.exports = {
  listMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember,
  getPlansAndSports,
};
