import { getAuth } from 'firebase-admin/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end(); // Method Not Allowed
  }

  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    // Proceed with your API logic
    res.status(200).json({ message: 'Authorized', uid: decodedToken.uid });
  } catch (error) {
    res.status(403).json({ message: 'Forbidden', error: error.message });
  }
}
