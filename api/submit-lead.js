// Vercel serverless function — forwards the site's contact form to a Telegram chat.
// Requires two env vars set in the Vercel project: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID.

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { name, phone, services } = req.body || {};

  if (!name || !phone) {
    res.status(400).json({ error: 'Укажите имя и телефон' });
    return;
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    res.status(500).json({ error: 'Бот не настроен' });
    return;
  }

  const lines = [
    '📩 Новая заявка с сайта KB Agency',
    `Имя: ${String(name).slice(0, 200)}`,
    `Телефон/Telegram: ${String(phone).slice(0, 200)}`,
  ];
  if (services) lines.push(`Пакет услуг: ${String(services).slice(0, 500)}`);

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: lines.join('\n') }),
    });
    if (!tgRes.ok) throw new Error('Telegram API error');
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(502).json({ error: 'Не удалось отправить заявку' });
  }
};
