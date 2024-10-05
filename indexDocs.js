require('dotenv').config();
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const Typesense = require('typesense');



const client = new Typesense.Client({
  nodes: [{
    host: process.env.TYPESENSE_HOST,
    port: process.env.TYPESENSE_PORT,
    protocol: process.env.TYPESENSE_PROTOCOL
  }],
  apiKey: process.env.TYPESENSE_API_KEY,
  connectionTimeoutSeconds: 2
});

async function createSchema() {
  const schema = {
    name: 'docs',
    fields: [
      { name: 'id', type: 'string' },
      { name: 'title', type: 'string' },
      { name: 'content', type: 'string' },
      { name: 'slug', type: 'string' }
    ]
  };

  await client.collections().create(schema);
}

function readMarkdownFiles(dir) {
  const results = [];
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      results.push(...readMarkdownFiles(filePath));
    } else if (path.extname(file) === '.mdx' || path.extname(file) === '.md') {
      const content = fs.readFileSync(filePath, 'utf8');
      const { data, content: markdown } = matter(content);
      results.push({
        id: path.relative('pages', filePath),
        slug: path.relative('pages', filePath).replace(/\.mdx?$/, ''),
        title: data.title || file.replace(/\.mdx?$/, ''),
        content: markdown
      });
    }
  }
  
  return results;
}

async function indexDocuments(documents) {
  return client.collections('docs').documents().import(documents);
}

async function main() {
  const docsDir = path.join(__dirname, 'pages');
  const documents = readMarkdownFiles(docsDir);

  try {
    await createSchema();
    console.log('Schema created successfully');
  } catch (error) {
    if (error.httpStatus === 409) {
      console.log('Collection already exists. Skipping schema creation.');
    } else {
      console.error('Error creating schema:', error);
      return;
    }
  }

  try {
    const result = await indexDocuments(documents);
    console.log(`Indexed ${result.length} documents`);
  } catch (error) {
    console.error('Error indexing documents:', error);
  }
}

main().catch(console.error);
