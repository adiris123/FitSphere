const paymentModel = require('../models/paymentModel');

const formatDate = (date) => {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().split('T')[0];
};

const listPayments = async (req, res) => {
  try {
    const payments = await paymentModel.getPayments();
    const formatted = payments.map((payment) => ({
      ...payment,
      date: payment.date ? formatDate(payment.date) : null,
    }));
    return res.json(formatted);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch payments', error: error.message });
  }
};

const createPayment = async (req, res) => {
  try {
    const { member_id, amount, status = 'Pending', date } = req.body;

    if (!member_id || !amount) {
      return res.status(400).json({ message: 'Member and amount are required' });
    }

    const payment = await paymentModel.createPayment({
      member_id,
      amount,
      status,
      date: formatDate(date) || formatDate(new Date()),
    });

    return res.status(201).json(payment);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create payment', error: error.message });
  }
};

const updatePayment = async (req, res) => {
  try {
    const paymentId = req.params.id;
    const { amount, status, date } = req.body;

    const existing = await paymentModel.getPaymentById(paymentId);
    if (!existing) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    const payload = {
      amount: typeof amount === 'number' ? amount : existing.amount,
      status: status || existing.status,
      date: formatDate(date) || formatDate(existing.date) || formatDate(new Date()),
    };

    await paymentModel.updatePayment(paymentId, payload);

    return res.json({ message: 'Payment updated' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update payment', error: error.message });
  }
};

const listMemberPayments = async (req, res) => {
  try {
    const memberId = req.params.memberId;
    const payments = await paymentModel.getPaymentsByMember(memberId);
    return res.json(
      payments.map((payment) => ({
        ...payment,
        date: payment.date ? formatDate(payment.date) : null,
      }))
    );
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch member payments', error: error.message });
  }
};

module.exports = {
  listPayments,
  createPayment,
  updatePayment,
  listMemberPayments,
};
