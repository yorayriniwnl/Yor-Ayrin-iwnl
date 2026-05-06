import buildPortfolio from '../lib/portfolio'
import { buildContextFromPortfolio, createPrompt } from '../lib/portfolioContext'
import answerQuestion from '../lib/qna'

// Example data
const repos = [
  {
    name: 'yor-website',
    full_name: 'yorayriniwnl/yor-website',
    html_url: 'https://github.com/yorayriniwnl/YorWebsite',
    description: 'Personal portfolio and site',
    language: 'TypeScript',
    topics: ['portfolio', 'nextjs'],
    stargazers_count: 42,
    forks_count: 4,
    watchers_count: 42,
    size: 1200,
  },
  {
    name: 'Yor-Zenith',
    full_name: 'yorayriniwnl/Yor-Zenith',
    html_url: 'https://github.com/yorayriniwnl/Yor-Zenith',
    description: 'Solar planning platform with React and Three.js dashboards',
    language: 'TypeScript',
    topics: ['threejs', '3d'],
    stargazers_count: 18,
    forks_count: 1,
    watchers_count: 18,
    size: 800,
  },
]

const readmes: Record<string, string> = {
  'yorayriniwnl/yor-website': `# Yor Website\n\nPersonal portfolio and collection of projects.\n\n## Built with\n- Next.js\n- TypeScript\n- Tailwind CSS\n\n## Highlights\n- Responsive portfolio with 3D demos\n- Rich interactive cursor and motion\n`,
  'yorayriniwnl/Yor-Zenith': `# Yor Zenith\n\nSolar planning platform for rooftop feasibility and energy generation estimation.\n\n## Built with\n- React\n- Three.js\n- Python\n- TypeScript\n\n## Highlights\n- Rooftop feasibility analysis\n- Energy generation forecasting\n`,
}

async function run() {
  const portfolio = buildPortfolio(repos as any, readmes)
  const { context } = buildContextFromPortfolio(portfolio, { tokenLimit: 800 })

  console.log('=== Context ===')
  console.log(context)

  const questions = [
    'What are the primary skills?',
    'Tell me about Yor Zenith project',
    'Would this person be a good frontend hire?'
  ]

  for (const q of questions) {
    const prompt = createPrompt(q, context)
    // In a real integration, send `prompt` to your LLM. Here we use local deterministic answerer.
    const res = answerQuestion(q, portfolio)
    console.log('\nQ:', q)
    console.log('A:', res.answer)
    if (res.sources.length) console.log('Sources:', res.sources.join(', '))
  }
}

run().catch((err) => { console.error(err); process.exit(1) })
