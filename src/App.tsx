import { useState, useEffect } from 'react'
import {
  MapPin,
  Mail,
  Phone,
  FileDown,
  Linkedin,
  Github,
  Briefcase,
  CalendarDays,
  Award,
  GraduationCap,
  User,
  FolderKanban,
  Wrench,
  Trophy,
  ExternalLink,
  ChevronRight,
  ChevronUp,
  Sparkles,
  Database,
  Code2,
  LayoutDashboard,
  Cpu,
  Cloud,
} from 'lucide-react'
import { NeuralNetwork3D } from './components/NeuralNetwork3D'
import { JarvisAssistant } from './components/JarvisAssistant'
import { Avatar } from './components/Avatar'
import { ProjectCarousel } from './components/ProjectCarousel'
import { useScrollY } from './hooks/useScrollY'
import { TiltCard } from './components/TiltCard'
import { StatCard } from './components/StatCard'

const NAV_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'contact', label: 'Contact' },
]

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
    location: 'Mumbai, India',
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
  { title: 'AI & Machine Learning', icon: Cpu, items: 'TensorFlow • PyTorch • Keras • Scikit-learn • OpenCV • Clustering' },
  { title: 'Generative AI & LLMs', icon: Sparkles, items: 'OpenAI API • Anthropic API • Gemini API • Prompt Engineering' },
  { title: 'AI-Assisted Dev Tools', icon: Code2, items: 'Cursor AI • GitHub Copilot • Vercel AI' },
  { title: 'Programming & Data', icon: Database, items: 'Python • SQL (MySQL) • HTML • CSS' },
  { title: 'BI & Visualization', icon: LayoutDashboard, items: 'Power BI • Tableau • Zoho Analytics • Excel' },
]

const EDUCATION = [
  { degree: 'Bachelor of Engineering — Information Technology', school: 'Terna Engineering College, Mumbai University, Mumbai', grade: 'CGPA: 7.92 / 10 | 2024' },
  { degree: 'Diploma — Computer Engineering', school: 'Loknete Gopinathji Munde Institute of Engineering Education & Research, MSBTE, Nashik', grade: '82.11% / 100% | 2021' },
]

const CERTIFICATIONS = [
  'Oracle Cloud: OCI Generative AI',
  'Oracle Cloud: Analytics Cloud',
  'Oracle Cloud: Data Platform Foundations',
  'Oracle Cloud: OCI Data Science',
  'NASSCOM: IT-ITeS Data Analytics — 92%',
  'ExcelR: Data Analytics Professional',
  'Skill India: Certified Data Analyst — Best Performer (MSME)',
]

const ACHIEVEMENTS = [
  'Best Performer — Elevate Labs National Internship (Skill India & MSME, 2024)',
  'Top 5 Performer — Guardneer Technologies (2024)',
  'Published Researcher — IJCRT Journal (2024)',
]

function Section({ id, title, icon: Icon, children, reveal = true }: { id: string; title: string; icon?: React.ComponentType<{ className?: string }>; children: React.ReactNode; reveal?: boolean }) {
  return (
    <section
      id={id}
      className={`scroll-mt-20 py-20 md:py-24 ${reveal ? 'reveal' : ''}`}
      data-reveal={reveal ? '' : undefined}
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <h2 className="mb-12 flex items-center gap-3 text-3xl font-bold text-white section-heading pb-3 border-b-2 border-emerald-500/50">
          {Icon && <Icon className="h-7 w-7 text-emerald-500 shrink-0" />}
          {title}
        </h2>
        {children}
      </div>
    </section>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const { easedScrollY } = useScrollY()
  const [recruiterMode, setRecruiterMode] = useState(false)
  const effectiveScrollY = recruiterMode ? 0 : easedScrollY

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 500)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) (entry.target as HTMLElement).classList.add('visible')
        })
      },
      { rootMargin: '-50px 0px -50px 0px', threshold: 0.05 }
    )
    document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const handleNavClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <div className="min-h-screen font-[family-name:var(--font-sans)]">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded bg-emerald-500 focus:px-4 focus:py-2 focus:text-slate-950 focus:outline-none">
        Skip to main content
      </a>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <button
        onClick={() => setRecruiterMode((r) => !r)}
        className="hidden md:flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-400 hover:border-emerald-500 hover:text-emerald-400 transition-colors"
      >
        {recruiterMode ? 'Full Site' : 'Recruiter Mode'}
      </button>
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('hero') }} className="text-lg font-bold text-white hover:text-emerald-400 transition-colors">
            Rutikesh Pawar
          </a>
          <nav className="hidden md:block" aria-label="Main">
            <ul className="flex gap-6">
              {NAV_LINKS.map(({ id, label }) => (
                <li key={id}>
                  <button
                    onClick={() => handleNavClick(id)}
                    className="text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <button
            onClick={() => setRecruiterMode((r) => !r)}
            className="hidden md:flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-400 hover:border-emerald-500 hover:text-emerald-400 transition-colors"
          >
            {recruiterMode ? 'Full Site' : 'Recruiter Mode'}
          </button>
          <button
            type="button"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-slate-700 text-slate-300 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className={`block h-0.5 w-5 rounded bg-current transition-all ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-5 rounded bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-5 rounded bg-current transition-all ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-slate-800 bg-slate-950 px-4 py-4 md:hidden">
            <ul className="flex flex-col gap-2">
              {NAV_LINKS.map(({ id, label }) => (
                <li key={id}>
                  <button onClick={() => handleNavClick(id)} className="w-full py-2 text-left text-slate-300 hover:text-emerald-400">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      <main id="main">
        {/* Hero */}
        <section id="hero" className="scroll-mt-0 border-b border-slate-800 bg-slate-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/8 via-transparent to-cyan-500/8 pointer-events-none" aria-hidden />
          <div
            className="absolute top-0 right-0 w-[700px] h-[500px] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"
            style={{ transform: `translateY(${effectiveScrollY * 0.15}px)` }}
            aria-hidden
          />
          <div
            className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"
            style={{ transform: `translateY(${effectiveScrollY * -0.1}px)` }}
            aria-hidden
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none"
            style={{ transform: `translate(calc(-50% + ${effectiveScrollY * 0.05}px), calc(-50% + ${effectiveScrollY * 0.08}px))` }}
            aria-hidden
          />
          <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 md:py-24">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 lg:items-center">
              <div>
                <div className="flex items-center gap-4 md:gap-5">
                  <TiltCard maxTilt={10} disabled={recruiterMode}>
                    <Avatar />
                  </TiltCard>
                  <div>
                    <p className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-emerald-400">
                      <Sparkles className="h-4 w-4" /> Data Analyst | Data Scientist | AI/ML Engineer
                    </p>
                    <h1 className="mt-1 text-4xl font-bold tracking-tight text-white sm:text-5xl">Rutikesh Pawar</h1>
                  </div>
                </div>
                <p className="mt-5 max-w-xl text-lg text-slate-400">
                  Data Analyst with 1+ year of experience, building AI/ML systems on the side — from a published crop-disease classifier to ML-powered trading bots — backed by Oracle Generative AI certification.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Currently Pursuing PGCP in Artificial Intelligence, CDAC Kharghar
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
                    <Award className="h-3 w-3" /> Published AI/ML Researcher (IJCRT 2024)
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
                    <Cloud className="h-3 w-3" /> Oracle Generative AI Certified
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                    <Database className="h-3 w-3" /> 600K+ Records Analyzed
                  </span>
                </div>
                <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-emerald-500 shrink-0" /> Pune, India
                  </span>
                  <a href="mailto:rutikeshpawar2000@gmail.com" className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors">
                    <Mail className="h-4 w-4 text-emerald-500 shrink-0" /> rutikeshpawar2000@gmail.com
                  </a>
                  <a href="tel:+919834869880" className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors">
                    <Phone className="h-4 w-4 text-emerald-500 shrink-0" /> +91 9834869880
                  </a>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="/Rutikesh_DA_Resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 font-semibold text-slate-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
                  >
                    <FileDown className="h-4 w-4" /> Download Resume
                  </a>
                  <a href="https://www.linkedin.com/in/rutikeshpawar227" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-5 py-2.5 font-medium text-slate-300 hover:border-emerald-500 hover:text-emerald-400 transition-colors">
                    <Linkedin className="h-4 w-4" /> LinkedIn
                  </a>
                  <a href="https://github.com/rutikeshpawar" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-5 py-2.5 font-medium text-slate-300 hover:border-emerald-500 hover:text-emerald-400 transition-colors">
                    <Github className="h-4 w-4" /> GitHub
                  </a>
                </div>
              <div className="mt-10 grid grid-cols-3 gap-4 max-w-sm">
                  {[
                    { target: 600, suffix: 'K+', label: 'Records Analyzed' },
                    { target: 40, suffix: '%', label: 'Reporting Efficiency' },
                    { target: 4, suffix: '', label: 'Internships' },
                  ].map((stat) => (
                    <StatCard key={stat.label} {...stat} />
                  ))}
                </div>
              </div>
              <div className="hidden lg:block h-[400px]" style={{ transform: `translateY(${effectiveScrollY * 0.08}px)` }}>
                <NeuralNetwork3D recruiterMode={recruiterMode} />
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <Section id="about" title="About Me" icon={User}>
          <div className="space-y-4 text-slate-400">
            <p className="text-slate-300 leading-relaxed">
              Data Analyst with <strong className="text-white">1+ year</strong> of experience across 4 internships and 10+ GitHub projects, specializing in <strong className="text-white">SQL</strong>, <strong className="text-white">Python</strong>, <strong className="text-white">Power BI</strong>, <strong className="text-white">Tableau</strong>, and <strong className="text-white">AI/ML</strong>, <strong className="text-white">TensorFlow</strong>, <strong className="text-white">TensorFlow</strong>, <strong className="text-white">PyTorch</strong>, and Generative AI.
            </p>
            <p className="leading-relaxed">
              Building AI/ML systems on the side including ML-powered trading systems, LLM-integrated tools, and AI-assisted development using Cursor AI and Vercel. Proven ability to transform large-scale datasets into executive dashboards and actionable business intelligence — delivering <strong className="text-emerald-400">40% reporting efficiency gains</strong>, <strong className="text-emerald-400">27% operational improvements</strong>, and <strong className="text-emerald-400">19% profitability increases</strong>.
            </p>
            <p className="leading-relaxed">
              Oracle Cloud–certified (4 credentials), NASSCOM-certified (92%), and published AI/ML researcher (IJCRT 2024). Actively seeking Data Analyst and AI/ML-focused roles.
            </p>
            <div className="mt-6 rounded-xl border border-slate-700/50 bg-emerald-500/10 p-5 card-enhanced">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-white">
                <Trophy className="h-4 w-4 text-emerald-400" /> Highlights
              </h3>
              <ul className="space-y-2 text-sm text-slate-400">
                {ACHIEVEMENTS.map((a) => (
                  <li key={a} className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 shrink-0 text-emerald-400" /> {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* Experience */}
        <section id="experience" className="scroll-mt-20 border-t border-slate-800 bg-slate-900/30 py-20 md:py-24 reveal" data-reveal>
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <h2 className="mb-12 flex items-center gap-3 text-3xl font-bold text-white section-heading pb-3 border-b-2 border-emerald-500/50">
              <Briefcase className="h-7 w-7 text-emerald-500" /> Professional Experience
            </h2>
            <div className="relative border-l-2 border-slate-700/50 pl-6 space-y-10">
              {EXPERIENCE.map((job, i) => (
                <article key={i} className="relative card-enhanced rounded-lg border border-slate-700/30 bg-slate-800/30 p-5">
                  <span className="absolute -left-[31px] top-5 h-3 w-3 rounded-full border-2 border-slate-900 bg-emerald-500 shadow-lg shadow-emerald-500/30" />
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="text-lg font-semibold text-white">{job.role}{job.badge && <span className="ml-2 text-emerald-400 font-normal">— {job.badge}</span>}</h3>
                    <span className="text-emerald-400 font-medium">{job.company}</span>
                    <span className="flex items-center gap-1 text-sm text-slate-500"><CalendarDays className="h-3.5 w-3.5" /> {job.period}</span>
                    <span className="flex items-center gap-1 text-sm text-slate-500"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                  </div>
                  <ul className="mt-3 list-disc space-y-1 pl-4 text-slate-400 text-sm leading-relaxed">
                    {job.points.map((p, j) => (
                      <li key={j}>{p}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Projects */}
        <Section id="projects" title="Featured Projects" icon={FolderKanban}>
          <div className="reveal-stagger grid gap-6 sm:grid-cols-2">
            {PROJECTS.map((proj, i) => (
              <TiltCard key={i} maxTilt={4} disabled={recruiterMode} className="project-card overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/40">
                {proj.images.length > 0 ? (
                  <ProjectCarousel images={proj.images} title={proj.title} projectUrl={proj.url} />
                ) : (
                  <a href={proj.url} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="flex aspect-video w-full items-center justify-center bg-slate-800/50 text-slate-500" aria-hidden>
                      <LayoutDashboard className="h-12 w-12" />
                    </div>
                  </a>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                      <FolderKanban className="h-4 w-4" />
                    </span>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{proj.title}</h3>
                      {proj.badge && (
                        <span className="inline-flex items-center gap-1 mt-1 text-xs font-medium text-amber-400">
                          <Award className="h-3 w-3" /> {proj.badge}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 font-mono">{proj.stack}</p>
                  <p className="mt-3 text-sm text-slate-400 leading-relaxed">{proj.description}</p>
                  <a href={proj.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400 hover:text-emerald-300">
                    View on GitHub <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </TiltCard>
            ))}
          </div>
        </Section>

        {/* Skills */}
        <section id="skills" className="scroll-mt-20 border-t border-slate-800 bg-slate-900/30 py-20 md:py-24 reveal" data-reveal>
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <h2 className="mb-12 flex items-center gap-3 text-3xl font-bold text-white section-heading pb-3 border-b-2 border-emerald-500/50">
              <Wrench className="h-7 w-7 text-emerald-500" /> Technical Skills
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {SKILL_GROUPS.map((g) => {
                const Icon = g.icon
                return (
                  <div key={g.title} className="skill-card flex gap-3 rounded-xl border border-slate-700/50 bg-slate-800/40 p-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-400">{g.title}</h3>
                      <p className="mt-2 text-sm text-slate-400">{g.items}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-6 rounded-xl border border-slate-700/50 bg-emerald-500/10 p-5 card-enhanced">
              <h3 className="text-sm font-semibold text-white">Core Competencies</h3>
              <p className="mt-2 text-sm text-slate-400">
                Data Analysis • Business Intelligence • Data Visualization • SQL Querying • Python • Statistical Analysis • EDA • KPI Reporting • Dashboard Development • ETL Pipelines • Data Cleaning • A/B Testing • Predictive Analytics • Data Storytelling • AI-Assisted Development • Report Automation • Stakeholder Communication
              </p>
            </div>
          </div>
        </section>

        {/* Education */}
        <Section id="education" title="Education" icon={GraduationCap}>
          <div className="space-y-4">
            {EDUCATION.map((e, i) => (
              <div key={i} className="skill-card flex gap-3 rounded-xl border border-slate-700/50 bg-slate-800/40 p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-white">{e.degree}</h3>
                  <p className="text-sm text-slate-500">{e.school}</p>
                  <p className="mt-1 text-sm font-mono text-emerald-400">{e.grade}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Certifications */}
        <section id="certifications" className="scroll-mt-20 border-t border-slate-800 bg-slate-900/30 py-20 md:py-24 reveal" data-reveal>
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <h2 className="mb-12 flex items-center gap-3 text-3xl font-bold text-white section-heading pb-3 border-b-2 border-emerald-500/50">
              <Award className="h-7 w-7 text-emerald-500" /> Certifications
            </h2>
            <ul className="space-y-3 text-slate-400">
              {CERTIFICATIONS.map((c, i) => (
                <li key={i} className="flex items-start gap-2 border-b border-slate-700/50 pb-3 last:border-0 last:pb-0">
                  <Award className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" /> {c}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Contact */}
        <Section id="contact" title="Get in Touch" icon={Mail}>
          <div className="grid gap-4 sm:grid-cols-2">
            <a href="mailto:rutikeshpawar2000@gmail.com" className="skill-card flex items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/40 p-4 text-slate-300 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <Mail className="h-5 w-5" />
              </span>
              rutikeshpawar2000@gmail.com
            </a>
            <a href="tel:+919834869880" className="skill-card flex items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/40 p-4 text-slate-300 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <Phone className="h-5 w-5" />
              </span>
              +91 9834869880
            </a>
            <a href="https://www.linkedin.com/in/rutikeshpawar227" target="_blank" rel="noopener noreferrer" className="skill-card flex items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/40 p-4 text-slate-300 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <Linkedin className="h-5 w-5" />
              </span>
              linkedin.com/in/rutikeshpawar227
            </a>
            <a href="https://github.com/rutikeshpawar" target="_blank" rel="noopener noreferrer" className="skill-card flex items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/40 p-4 text-slate-300 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <Github className="h-5 w-5" />
              </span>
              github.com/rutikeshpawar
            </a>
          </div>
          <p className="mt-6 flex items-center gap-2 text-slate-500">
            <Sparkles className="h-4 w-4 text-emerald-500/70" /> Open to Data Analyst and AI/ML-focused roles. Let’s connect.
          </p>
        </Section>
      </main>

      {showBackToTop && (
        <a
          href="#hero"
          onClick={(e) => { e.preventDefault(); document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' }) }}
          className="back-to-top fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 text-slate-950 shadow-lg hover:bg-emerald-400"
          aria-label="Back to top"
        >
          <ChevronUp className="h-5 w-5" />
        </a>
      )}

      <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-500">
        <div className="mx-auto max-w-4xl px-4">
          © {new Date().getFullYear()} Rutikesh Pawar. Data Scientist and AI Engineer Portfolio.
        </div>
      </footer>

      {/* Jarvis AI Assistant */}
      <JarvisAssistant recruiterMode={recruiterMode} />
    </div>
  )
}

export default App
