import Typesense from 'typesense';

export default async function handler(req, res) {
  const typesenseClient = new Typesense.Client({
    nodes: [{
      host: process.env.TYPESENSE_HOST,
      port: process.env.TYPESENSE_PORT,
      protocol: process.env.TYPESENSE_PROTOCOL
    }],
    apiKey: process.env.TYPESENSE_API_KEY,
    connectionTimeoutSeconds: 2
  });

  try {
    const health = await typesenseClient.health.retrieve();
    res.status(200).json({ message: 'Typesense is connected', health });
  } catch (error) {
    console.error('Typesense connection error:', error);
    res.status(500).json({ message: 'Failed to connect to Typesense', error: error.message });
  }
}