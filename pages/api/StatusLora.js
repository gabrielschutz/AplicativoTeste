export default function handler(req, res) {
  const status = {
    status: 'off',
  };

  res.status(200).json(status);
}