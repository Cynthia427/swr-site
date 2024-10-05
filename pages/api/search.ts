import type { NextApiRequest, NextApiResponse } from 'next';
import Typesense from 'typesense';

const typesenseClient = new Typesense.Client({
  nodes: [
    {
      host: process.env.TYPESENSE_HOST || '',
      port: parseInt(process.env.TYPESENSE_PORT || '443'),
      protocol: process.env.TYPESENSE_PROTOCOL || 'https',
    },
  ],
  apiKey: process.env.TYPESENSE_API_KEY || '',
  connectionTimeoutSeconds: 2,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    let { q } = req.query;

    // Ensure q is a string (if it's an array, get the first element)
    if (Array.isArray(q)) {
      q = q[0]; // Take the first element if it's an array
    }

    try {
      console.log('Searching with query:', q);
      const searchResults = await typesenseClient.collections('docs').documents().search({
        q: q || '*', // If q is undefined or empty, use '*'
        query_by: 'title,content',
        per_page: 5,
      });
      console.log('Search results:', JSON.stringify(searchResults, null, 2));
      res.status(200).json(searchResults.hits || []);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'An error occurred while searching.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}