export default async function handler(req, res) {
  // Nur deine eigene Domain darf diese Funktion aufrufen
  res.setHeader('Access-Control-Allow-Origin', 'https://omisliebenmich.de');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { username } = req.query;
  const channelId = process.env.SE_CHANNEL_ID;
  const jwt = process.env.SE_JWT_TOKEN;

  if (!username) {
    return res.status(400).json({ error: 'username fehlt' });
  }
  if (!channelId || !jwt) {
    return res.status(500).json({ error: 'Server nicht konfiguriert (Environment Variables fehlen)' });
  }

  try {
    const response = await fetch(
      `https://api.streamelements.com/kappa/v2/points/${channelId}/${encodeURIComponent(username)}`,
      { headers: { Authorization: `Bearer ${jwt}` } }
    );
    const data = await response.json();
    return res.status(200).json({ points: data.points ?? 0 });
  } catch (err) {
    return res.status(500).json({ error: 'StreamElements nicht erreichbar' });
  }
}
