import { GoogleGenAI } from '@google/genai'

// Model configuration
const GEMINI_MODEL = 'gemini-3.1-flash-lite'

// Simple in-memory rate limiting
// NOTE: This resets on cold start and isn't distributed-safe,
// but is acceptable for Hobby-tier low traffic use cases.
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const MAX_REQUESTS_PER_DAY = 10
const DAY_IN_MS = 24 * 60 * 60 * 1000

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    // New record or expired
    rateLimitMap.set(ip, { count: 1, resetTime: now + DAY_IN_MS })
    return { allowed: true, remaining: MAX_REQUESTS_PER_DAY - 1 }
  }

  if (record.count >= MAX_REQUESTS_PER_DAY) {
    return { allowed: false, remaining: 0 }
  }

  record.count++
  return { allowed: true, remaining: MAX_REQUESTS_PER_DAY - record.count }
}

// Context data for the AI assistant
const EXPERIENCE = [
  {
    role: 'Data Analyst',
    company: 'Neubrain Solution Pvt. Ltd.',
    period: 'Aug 2024 – Present',
    location: 'Navi Mumbai, India',
    points: [
      'Leveraged Cursor AI to accelerate Python and SQL data pipeline development — reducing script-writing time by 30% and improving code quality. Built and deployed interactive data analytics web applications using Vercel.',
      'Designed and deployed real-time executive dashboards using Power BI, Zoho Analytics, and SQL — increasing reporting efficiency by 40% and decision-making accuracy by 30% across business units.',
      'Conducted EDA and statistical analysis on operational datasets to surface revenue trends, anomalies, and growth opportunities — informing C-suite strategic decisions.',
    ],
  },
  {
    role: 'Data Analyst Intern',
    badge: 'Ranked #1 Best Performer (National)',
    company: 'Elevate Labs (Skill India / MSME)',
    period: 'Aug 2024 – Sep 2024',
    location: 'Remote',
    points: [
      'Ranked Best Performer nationally; delivered end-to-end Tableau, Power BI, and SQL dashboards covering sales, customer segmentation, and operations — automating KPI pipelines and cutting manual effort by 35%.',
      'Used Cursor AI to streamline data cleaning and transformation scripts, accelerating EDA turnaround by 25% and ensuring reproducible, well-documented workflows.',
    ],
  },
  {
    role: 'Data Analytics Intern',
    company: 'Variant AI',
    period: 'Apr 2024 – Oct 2024',
    location: 'Remote',
    points: [
      'Analysed 60,000+ records across Zomato (9,500 restaurants, 15 countries) and Healthcare (10,000+ patients) using SQL CTEs, Python Pandas, and Power BI — improving data processing accuracy by 30%.',
      'Surfaced ₹8.45M in Zomato sales trends and identified hospital workflow inefficiencies via statistical root-cause analysis, contributing to 18% operational efficiency improvement.',
    ],
  },
  {
    role: 'Data Analyst Intern',
    badge: 'Top 5 Performer',
    company: 'Guardneer Technologies (S.V. Krishi Nature)',
    period: 'Jun 2024 – Dec 2024',
    location: 'Pune, India (Remote)',
    points: [
      'Built Tableau and Power BI dashboards for 1,000+ farm records with custom KPIs (Water Risk Index, Profit/Acre, Soil Health Score) — driving 27% irrigation efficiency gain and 19% profitability increase.',
      'Applied Python predictive analytics and ML clustering on agricultural sensor data; automated anomaly detection pipelines, boosting farm productivity by 25%.',
    ],
  },
]

const PROJECTS = [
  {
    title: 'Nifty50 Stock Market AI Auto-Trading System',
    stack: 'Python • Scikit-learn • Pandas • REST APIs • Websockets • Streamlit • Cursor AI',
    description: 'Built an AI-powered auto-trading system for Nifty50 with a real-time UI dashboard for signal visualization, trade execution, and portfolio tracking. Integrated live market data via APIs and applied ML models for buy/sell signal prediction with automated trade logic. Status: In Progress (Mar 2026 – Present)',
    url: '#',
    images: [] as string[],
  },
  {
    title: 'YouTube Automation AI',
    stack: 'Python • YouTube Data API v3 • REST APIs • LLM APIs (Claude/ChatGPT) • AI Video Generation Tools • MySQL',
    description: 'Built an AI-powered YouTube automation system — dataset-driven script generation via Claude/ChatGPT, audio generation via ElevenLabs, AI video creation, automated editing, and auto-upload using YouTube Data API v3. Status: In Progress (May 2026 – Present)',
    url: '#',
    images: [] as string[],
  },
  {
    title: 'Cropify — AI Crop Disease Detection',
    badge: 'Published: IJCRT 2024',
    stack: 'Python • OpenCV • Scikit-learn • ML Image Classification',
    description: 'BE Major Project — Published in IJCRT 2024. Built ML image classification model for crop disease detection achieving 85% accuracy; findings published in IJCRT Journal (2024).',
    url: 'https://github.com/rutikeshpawar',
    images: [] as string[],
  },
  {
    title: 'Cryptocurrency Trading AI',
    stack: 'Python • Pandas • Scikit-learn • Backtesting Framework • REST APIs',
    description: 'Developed an AI trading system for cryptocurrency markets, backtested across 10 years of historical price data to validate strategy performance. Automated buy/sell signal generation using ML-based predictive models with risk management logic. Status: In Progress (Apr 2026 – Present)',
    url: '#',
    images: [] as string[],
  },
  {
    title: 'Zomato Sales Analytics Dashboard',
    stack: 'Python • SQL (CTEs, Window Fns) • Power BI • Tableau • Excel • Cursor AI',
    description: 'Analyzed 9,500+ restaurants across 15 countries; identified ₹8.45M in sales trends, top cuisines, and city-level demand patterns. Deployed interactive Power BI + Tableau dashboards with drill-through filters and DAX KPIs — reducing manual analysis time by 40%.',
    url: 'https://github.com/rutikeshpawar/Zomato-Data-Analytics-Project',
    images: [
      'https://raw.githubusercontent.com/rutikeshpawar/Zomato-Data-Analytics-Project/main/Power_BI/dashboard_overview_powerbi.png',
      'https://raw.githubusercontent.com/rutikeshpawar/Zomato-Data-Analytics-Project/main/Power_BI/dashboard_detailed_analysis_powerbi.png',
    ],
  },
  {
    title: 'Healthcare Analytics Dashboard',
    stack: 'Python (Pandas, Seaborn) • SQL • Power BI • Tableau • Cursor AI',
    description: 'Processed 10,000+ patient and 1,000+ physician records; identified bottlenecks via EDA and statistical analysis — contributing to 18% hospital operational efficiency improvement.',
    url: 'https://github.com/rutikeshpawar/Healthcare-Data-Analytics-Project-VariantAI',
    images: [
      'https://raw.githubusercontent.com/rutikeshpawar/Healthcare-Data-Analytics-Project-VariantAI/main/Healthcare_Dashboard_SS.png',
      'https://raw.githubusercontent.com/rutikeshpawar/Healthcare-Data-Analytics-Project-VariantAI/main/HealthCare_Tableau_Dashboard_SS.png',
      'https://raw.githubusercontent.com/rutikeshpawar/Healthcare-Data-Analytics-Project-VariantAI/main/Healthcare_Excel_Dashboard_SS.png',
    ],
  },
  {
    title: 'Smart Farming & Water Quality Analytics (Guardneer)',
    stack: 'Python (Clustering, Feature Engineering) • SQL • Tableau • Power BI',
    description: 'Engineered Water Quality Monitoring + Customer Segmentation dashboards with Tableau KPIs and Python ML clustering; improved irrigation efficiency 27% and farm productivity 25%.',
    url: 'https://github.com/rutikeshpawar/Guardneer_Internship_Projects',
    images: [
      'https://raw.githubusercontent.com/rutikeshpawar/Guardneer_Internship_Projects/main/3_guardneer-smart-farming/Guardneer%20-%20Smart%20Farming%20and%20Water%20Optimization%20Dashboard.png',
      'https://raw.githubusercontent.com/rutikeshpawar/Guardneer_Internship_Projects/main/1-water-quality-dashboard/Guardneer%20Dashboard.png',
      'https://raw.githubusercontent.com/rutikeshpawar/Guardneer_Internship_Projects/main/2_Guardneer-Customer-Segmentation-Dashboard/Customer_Segment_Guardneer%20.png',
    ],
  },
  {
    title: 'Retail Business Performance & Profitability Analysis',
    stack: 'Python • SQL • Data Analysis • Dashboard',
    description: 'Retail inventory and performance analysis with SQL and Python; built dashboards for profitability and business performance insights.',
    url: 'https://github.com/rutikeshpawar/Retail-Business-Performance-Profitability-Analysis',
    images: ['https://raw.githubusercontent.com/rutikeshpawar/Retail-Business-Performance-Profitability-Analysis/main/dashboard_ss.jpg'],
  },
  {
    title: 'Amazon Customer Analytics Dashboards',
    stack: 'Tableau • Excel • Amazon Sales Data (FY 2022-23)',
    description: 'Interactive Tableau dashboards analyzing Amazon sales data across regions, categories, discounts, and customer demographics.',
    url: 'https://github.com/rutikeshpawar/Amazon-Customer-Analytics-Dashboards',
    images: [
      'https://raw.githubusercontent.com/rutikeshpawar/Amazon-Customer-Analytics-Dashboards/main/Customer-Analytis-Revenue.png',
      'https://raw.githubusercontent.com/rutikeshpawar/Amazon-Customer-Analytics-Dashboards/main/Customer-Analytis-Categorywise.png',
      'https://raw.githubusercontent.com/rutikeshpawar/Amazon-Customer-Analytics-Dashboards/main/Customer-Analytis-Discount%26Orders.png',
    ],
  },
  {
    title: 'CEO Quality Dashboard — Country Delight',
    stack: 'Power BI • Python • Jupyter • Quality & Complaints Data',
    description: 'CEO-level quality dashboard for Country Delight: complaints, quality metrics, profit/loss, and returns analysis with Power BI.',
    url: 'https://github.com/rutikeshpawar/CEO-Quality-Dashboard-Project-Country-Delight',
    images: [
      'https://raw.githubusercontent.com/rutikeshpawar/CEO-Quality-Dashboard-Project-Country-Delight/main/quality.png',
      'https://raw.githubusercontent.com/rutikeshpawar/CEO-Quality-Dashboard-Project-Country-Delight/main/complaints.png',
      'https://raw.githubusercontent.com/rutikeshpawar/CEO-Quality-Dashboard-Project-Country-Delight/main/profitloss.png',
    ],
  },
]

const SKILL_GROUPS = [
  { title: 'AI & Machine Learning', items: 'TensorFlow • PyTorch • Keras • Scikit-learn • OpenCV • Clustering' },
  { title: 'Generative AI & LLMs', items: 'OpenAI API • Anthropic API • Gemini API • Prompt Engineering' },
  { title: 'AI-Assisted Dev Tools', items: 'Cursor AI • GitHub Copilot • Vercel AI' },
  { title: 'Programming & Data', items: 'Python • SQL (MySQL) • HTML • CSS' },
  { title: 'BI & Visualization', items: 'Power BI • Tableau • Zoho Analytics • Excel' },
]

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { question } = req.body

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required' })
    }

    // Get client IP for rate limiting
    const ip = req.headers['x-forwarded-for']?.split(',')[0] ||
               req.headers['x-real-ip'] ||
               req.socket?.remoteAddress ||
               'unknown'

    const rateLimit = checkRateLimit(ip)
    if (!rateLimit.allowed) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again tomorrow.' })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' })
    }

    // Build system prompt with context data
    const contextData = {
      experience: EXPERIENCE,
      projects: PROJECTS,
      skills: SKILL_GROUPS,
    }

    const systemPrompt = `You are Jarvis, an AI assistant for Rutikesh Pawar's portfolio. You answer questions about Rutikesh's experience, projects, and skills using ONLY the following context data. If a question asks about information not present in this context, respond with "I don't have that information about Rutikesh." Be helpful, professional, and concise.

Context Data:
${JSON.stringify(contextData, null, 2)}

Rules:
- Answer only using the provided context data
- If information is not in the context, say "I don't have that information about Rutikesh."
- Be helpful and professional
- Keep responses concise and relevant
- Focus on concrete details from the experience, projects, and skills data`

    try {
      const ai = new GoogleGenAI({ apiKey })
      const result = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: `${systemPrompt}\n\nUser: ${question}`,
      })

      const response = result.text
      const remaining = rateLimit.remaining

      return res.status(200).json({
        response,
        remaining,
      })
    } catch (geminiError: any) {
      console.error('Gemini API error:', geminiError)
      const errorMessage = geminiError?.message || 'Unknown Gemini API error'
      return res.status(500).json({ 
        error: 'Failed to process request',
        details: errorMessage
      })
    }

  } catch (error: any) {
    console.error('Error in ask API:', error)
    const errorMessage = error?.message || 'Unknown error'
    return res.status(500).json({ 
      error: 'Failed to process request',
      details: errorMessage
    })
  }
}
