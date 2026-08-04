const FIREBASE_URL = "https://omisweb-club-default-rtdb.europe-west1.firebasedatabase.app";

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  let username = (req.query.username || '').trim().replace(/^@/, '');
  let grund = (req.query.grund || 'Twitch-Chat-Befehl').trim();

  if (!username) {
    return res.status(200).send('⚠️ Bitte einen Nutzernamen angeben: !gelbekarte @name');
  }

  try {
    const fbRes = await fetch(`${FIREBASE_URL}/zuschauerListe.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: username, grund: grund, typ: 'gelb' })
    });
    if (!fbRes.ok) throw new Error('Firebase-Fehler');
    return res.status(200).send(`🟨 Gelbe Karte für ${username} eingetragen!`);
  } catch (e) {
    return res.status(200).send('⚠️ Fehler: Karte konnte nicht eingetragen werden.');
  }
}
