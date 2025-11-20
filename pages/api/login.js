export default function handler(req, res) {
  const { username, password } = req.body;

  // Hard-coded login
  const validUsername = "OdiaIT";
  const validPassword = "ajaykumb";

  if (username === validUsername && password === validPassword) {
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ success: false });
}
