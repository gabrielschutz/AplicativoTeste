export default function handler(req, res) {
  const status = {
    status: 'on',
  };
  res.status(200).json(status);
}
