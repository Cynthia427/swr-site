import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import Typesense from 'typesense';

interface Document {
  title: string;
  content: string;
}

interface SearchResponseHit<T = any> {
  document: T;
}

interface SearchResponse<T = any> {
  hits?: SearchResponseHit<T>[];
}

interface AIAssistantResponse {
  response: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const typesenseClient = new Typesense.Client({
  nodes: [{ host: process.env.TYPESENSE_HOST || 'localhost', port: 8108, protocol: 'http' }],
  apiKey: process.env.TYPESENSE_API_KEY || 'xyz',
});

const systemPrompt = `
  You are an AI assistant specifically trained to help users with questions about our documentation.
  Your responses should be based solely on the information provided in the context.
  Follow these guidelines:

  1. Only use information from the given context to answer questions.
  2. If the context doesn't contain relevant information to answer the question, say "I'm sorry, but I don't have enough information in the documentation to answer that question."
  3. Do not make up or infer information that is not explicitly stated in the context.
  4. If you're unsure about any part of the answer, express that uncertainty.
  5. Keep your answers concise and to the point.
  6. If appropriate, suggest where the user might find more information within the documentation.
  7. Always maintain a helpful and professional tone.

  Format your responses for clarity and readability:
  - Use short paragraphs with line breaks between them.
  - Use bullet points or numbered lists for multiple items or steps.
  - Use bold text (enclosed in **asterisks**) for emphasis on key points or terms.
  - If providing code snippets, enclose them in triple backticks (\`\`\`) for proper formatting.
  - Use headings (preceded by ###) to separate different sections of your response, if applicable.

  Example structure:
  ### Main Answer
  Your main response goes here, broken into paragraphs as needed.

  ### Key Points:
  - First key point
  - Second key point
  - Third key point

  ### Additional Information
  Any extra details or context can go here.
`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AIAssistantResponse | { error: string }>
) {
  console.log('Received request:', JSON.stringify(req.body, null, 2));

  if (req.method !== 'POST') {
    console.log(`Method ${req.method} not allowed`);
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { query } = req.body;

    if (!query) {
      console.log('No query provided');
      return res.status(400).json({ error: 'Query is required' });
    }

    console.log('Searching Typesense for:', query);
    const searchResults: SearchResponse = await typesenseClient.collections('docs').documents().search({
      q: query,
      query_by: 'title,content',
      per_page: 3,
    });

    console.log('Typesense search results:', JSON.stringify(searchResults, null, 2));

    const relevantContent = searchResults.hits
      ?.map((hit) => {
        const doc = hit.document as Document;
        return `Title: ${doc.title}\n\nContent: ${doc.content}`;
      })
      .join('\n\n') || '';

    if (!relevantContent) {
      console.log('No relevant content found');
      return res.status(200).json({ response: "I'm sorry, but I couldn't find any relevant information in the documentation to answer your question." });
    }

    console.log('Relevant content:', relevantContent);

    console.log('Calling OpenAI API');
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Context: ${relevantContent}\n\nQuestion: ${query}` },
      ],
    });

    const aiResponse = completion.choices[0].message.content;
    console.log('AI Response:', aiResponse);

    res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error('AI Assistant error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
}