export default function handler(req, res) {
  const status = {
    status: 'Error',
  };

  res.status(200).json(status);
}