import type { NextApiRequest, NextApiResponse } from 'next';
import Typesense from 'typesense';

const typesenseClient = new Typesense.Client({
  nodes: [{
    host: process.env.TYPESENSE_HOST || 'localhost',
    port: parseInt(process.env.TYPESENSE_PORT || '8108'),
    protocol: process.env.TYPESENSE_PROTOCOL || 'http'
  }],
  apiKey: process.env.TYPESENSE_API_KEY || 'xyz',
  connectionTimeoutSeconds: 2
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log('Typesense configuration:', {
      host: process.env.TYPESENSE_HOST,
      port: process.env.TYPESENSE_PORT,
      protocol: process.env.TYPESENSE_PROTOCOL
    });

    // Test connection
    const health = await typesenseClient.health.retrieve();
    console.log('Typesense health:', health);

    // List collections
    const collections = await typesenseClient.collections().retrieve();
    console.log('Typesense collections:', collections);

    // Search test
    const searchResults = await typesenseClient.collections('docs').documents().search({
      q: '*',
      query_by: 'title,content',
      per_page: 1
    });
    console.log('Typesense search test results:', JSON.stringify(searchResults, null, 2));

    res.status(200).json({ message: 'Typesense connection successful', health, collections, searchResults });
  } catch (error) {
    console.error('Typesense test error:', error);
    res.status(500).json({ error: 'Failed to connect to Typesense', details: error.message });
  }
}