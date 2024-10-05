# SWR Documentation Site

This is the official documentation site for SWR (stale-while-revalidate), a React Hooks library for remote data fetching. The site is built with Next.js and Nextra, and uses Typesense for search functionality.

## Features

- Comprehensive documentation for SWR
- Multi-language support
- Full-text search powered by Typesense
- AI-assisted Q&A using OpenAI
- Integration with Agency Swarm for advanced queries

## Prerequisites

- Node.js (version 14 or later)
- pnpm
- Docker (for local development with Typesense)

## Getting Started

### Local Development

1. Clone the repository:
git clone https://github.com/your-username/swr-site.git
cd swr-site
Copy
2. Install dependencies:
pnpm install
Copy
3. Set up environment variables:
Create a `.env.local` file in the root directory and add the following variables:
TYPESENSE_API_KEY=your_local_api_key
TYPESENSE_HOST=localhost
TYPESENSE_PORT=8108
TYPESENSE_PROTOCOL=http
OPENAI_API_KEY=your_openai_api_key
AGENCY_SWARM_API_KEY=your_agency_swarm_api_key
CREATE_CHAT_URL=https://agency-swarm-app-japboyzddq-uc.a.run.app/create_new_chat/
AGENCY_SWARM_URL=https://agency-swarm-app-japboyzddq-uc.a.run.app/get_completion/

4. Start the local Typesense instance:
docker-compose -f docker-compose.local.yml up -d
Copy
5. Run the development server:
pnpm dev
Copy
6. Index the documentation:
pnpm run index-docs
Copy
7. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Production Deployment (Railway)

1. Fork this repository to your GitHub account.

2. Create a new project on [Railway](https://railway.app/).

3. Connect your GitHub repository to the Railway project.

4. Set up the following environment variables in your Railway project settings:
- `TYPESENSE_API_KEY`
- `TYPESENSE_HOST`
- `TYPESENSE_PORT`
- `TYPESENSE_PROTOCOL`
- `OPENAI_API_KEY`
- `AGENCY_SWARM_API_KEY`
- `CREATE_CHAT_URL`
- `AGENCY_SWARM_URL`

5. Deploy your project on Railway.

6. After deployment, run the indexing script as a one-time job on Railway: `node indexDocs.js`

## Project Structure

- `pages/`: Contains all the documentation pages in MDX format
- `components/`: React components used throughout the site
- `styles/`: CSS styles
- `public/`: Static assets
- `theme.config.js`: Nextra theme configuration
- `next.config.js`: Next.js configuration
- `indexDocs.js`: Script to index documentation in Typesense

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [SWR](https://swr.vercel.app/) - React Hooks for Data Fetching
- [Next.js](https://nextjs.org/) - The React Framework
- [Nextra](https://nextra.site/) - Next.js static site generator
- [Typesense](https://typesense.org/) - Fast, typo-tolerant search engine
- [OpenAI](https://openai.com/) - AI language model for Q&A
- [Agency Swarm](https://www.agencyswarm.com/) - Advanced query processing
