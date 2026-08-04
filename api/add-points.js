export default async function handler(req, res) {
  // Nur deine eigene Domain darf diese Funktion aufrufen
  res.setHeader('Access-Control-Allow-Origin', 'https://omisliebenmich.de');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Nur POST erlaubt' });
  }

  const { username, amount } = req.body || {};
  const channelId = process.env.SE_CHANNEL_ID;
  const jwt = process.env.SE_JWT_TOKEN;

  if (!username || typeof amount !== 'number') {
    return res.status(400).json({ error: 'username oder amount fehlt/ungueltig' });
  }
  if (!channelId || !jwt) {
    return res.status(500).json({ error: 'Server nicht konfiguriert (Environment Variables fehlen)' });
  }

  try {
    // amount kann positiv (gutschreiben) oder negativ (abziehen) sein
    const response = await fetch(
      `https://api.streamelements.com/kappa/v2/points/${channelId}/${encodeURIComponent(username)}/${amount}`,
      { method: 'PUT', headers: { Authorization: `Bearer ${jwt}` } }
    );
    const data = await response.json();
    return res.status(200).json({ points: data.newAmount ?? null });
  } catch (err) {
    return res.status(500).json({ error: 'StreamElements nicht erreichbar' });
  }
}
