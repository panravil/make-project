export default async function handler(req, res) {
  if (req.query.secret !== process.env.NEXT_SECRETE_KEY) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    await res.revalidate(req.query.path);
    res.json({
      revalidate: true
    });
  } catch (err) {
    return res.status(500).send('Error Revalidating!');
  }
}