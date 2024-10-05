import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import Typesense from 'typesense';

const AGENCY_SWARM_API_URL = process.env.AGENCY_SWARM_URL || 'https://agency-swarm-app-japboyzddq-uc.a.run.app/get_completion/';
const API_KEY = process.env.AGENCY_SWARM_API_KEY;

// Initialize Typesense client
const typesenseClient = new Typesense.Client({
  nodes: [{
    host: process.env.TYPESENSE_HOST || 'https://9619-2003-c3-6f29-f969-4de4-2fc4-107a-d6ea.ngrok-free.ap',
    port: process.env.TYPESENSE_PORT ? parseInt(process.env.TYPESENSE_PORT) : 8108,
    protocol: process.env.TYPESENSE_PROTOCOL || 'https'
  }],
  apiKey: process.env.TYPESENSE_API_KEY || 'xyz',
  connectionTimeoutSeconds: 2
});

console.log('Typesense Configuration:', JSON.stringify({
  host: process.env.TYPESENSE_HOST,
  port: process.env.TYPESENSE_PORT,
  protocol: process.env.TYPESENSE_PROTOCOL,
  apiKey: process.env.TYPESENSE_API_KEY ? '****' : 'Not Set'
}, null, 2));

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    console.log('Received request:', JSON.stringify(req.body, null, 2));

    const { message, apiIntegrationId } = req.body;

    if (!message || !apiIntegrationId) {
      return res.status(400).json({ error: 'message and apiIntegrationId are required' });
    }

    console.log('Searching Typesense for:', message);

    // Search Typesense
    const searchResults = await typesenseClient.collections('docs').documents().search({
      q: message,
      query_by: 'title,content',
      per_page: 3
    });

    console.log('Typesense search results:', JSON.stringify(searchResults, null, 2));

    // Prepare context from search results
    const relevantContent = searchResults.hits
      ?.map((hit: any) => `Title: ${hit.document.title}\n\nContent: ${hit.document.content}`)
      .join('\n\n') || '';

    // Prepare data for Agency Swarm
    const agencySwarmPayload = {
      message: `Context: ${relevantContent}\n\nQuestion: ${message}`,
      apiIntegrationId,
      attachments: []
    };

    console.log('Sending data to Agency Swarm:', JSON.stringify(agencySwarmPayload, null, 2));

    // Call Agency Swarm API
    const response = await axios.post(AGENCY_SWARM_API_URL, agencySwarmPayload, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Agency Swarm API response:', JSON.stringify(response.data, null, 2));

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
}

console.log('Typesense Configuration:', {
  host: process.env.TYPESENSE_HOST,
  port: process.env.TYPESENSE_PORT,
  protocol: process.env.TYPESENSE_PROTOCOL,
  apiKey: process.env.TYPESENSE_API_KEY ? '[REDACTED]' : undefined
});