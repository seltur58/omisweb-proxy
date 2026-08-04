const FIREBASE_URL = "https://omisweb-club-default-rtdb.europe-west1.firebasedatabase.app";

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  const username = (req.query.username || '').trim().replace(/^@/, '');
  const amount = parseInt(req.query.amount) || 1;

  if (!username) {
    return res.status(200).send('username fehlt');
  }

  try {
    // aktuellen Stand für diesen Gifter holen
    const getRes = await fetch(`${FIREBASE_URL}/gifterStats/${encodeURIComponent(username)}.json`);
    const aktuell = (await getRes.json()) || 0;
    const neu = aktuell + amount;

    // neuen Stand speichern
    await fetch(`${FIREBASE_URL}/gifterStats/${encodeURIComponent(username)}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(neu)
    });

    return res.status(200).send(`OK: ${username} hat jetzt insgesamt ${neu} Subs gegiftet.`);
  } catch (e) {
    return res.status(200).send('Fehler beim Speichern');
  }
}
