const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.profile.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.project.deleteMany();
  await prisma.faq.deleteMany();

  await prisma.profile.create({
    data: {
      fullName: "Rexy Anggala Putra",
      headline: "Business Intelligence Specialist",
      tagline: "Data analyst and business intelligence specialist with 4+ years of experience transforming complex data into actionable insights.",
      bio: "Hi, I am Rexy Anggala Putra, a data analyst with over 4 years of experience transforming complex data into actionable insights that drive strategic business decisions. My journey began through self-learning and evolved into a professional career across business intelligence, analytics, reporting automation, and real-world data projects. I bring strong expertise in SQL, Python, statistics, and visualization tools such as Looker Studio, Tableau, Metabase, and MicroStrategy, with a focus on solving business problems, optimizing processes, and helping organizations make smarter data-driven decisions.",
      photoUrl: "/assets/profile-rexy.jpeg",
      location: "Pekalongan, Central Java, Indonesia",
      email: "rexyanggalaputra@gmail.com",
      whatsapp: "https://wa.me/",
      linkedin: "https://www.linkedin.com/in/rexyanggalaputra",
      github: "https://github.com/rexyanggalaputra",
      cvUrl: null,
    },
  });

  await prisma.skill.createMany({
    data: [
      ["SQL", "Data", 5],
      ["Python", "Data", 5],
      ["Data Scraping", "Data", 4],
      ["Statistics", "Data", 4],
      ["Data Wrangling", "Data", 4],
      ["Looker Studio", "BI Tools", 5],
      ["MicroStrategy", "BI Tools", 5],
      ["Tableau", "BI Tools", 4],
      ["Metabase", "BI Tools", 4],
      ["Google Sheets", "Tools", 5],
      ["Microsoft Excel", "Tools", 5],
      ["Snowflake", "Database", 4],
      ["Greenplum", "Database", 4],
      ["PostgreSQL", "Database", 4],
      ["Dashboard Automation", "Business Intelligence", 5],
      ["Reporting Automation", "Business Intelligence", 5],
      ["Data Pipeline", "Business Intelligence", 4],
      ["Business Analysis", "Business Intelligence", 4],
    ].map(([name, category, level], order) => ({ name, category, level, order })),
  });

  await prisma.experience.createMany({
    data: [
      {
        role: "Business Intelligence Analyst",
        company: "Blibli",
        location: "Jakarta Pusat",
        startDate: new Date("2025-10-01"),
        isCurrent: true,
        description: "Developed and deployed scalable automated data pipelines for near real-time reporting, operational monitoring, reconciliation, and financial validation. Automated complex data integration workflows across multiple business sources, reducing manual handling by over 95% and improving accuracy, consistency, and reliability. Delivered reporting and analytical presentations for management and external clients, including analysis for packaging cost optimization, customer cohort retention, product performance, and multi-warehouse expansion strategy.",
        order: 0,
      },
      {
        role: "Tutor",
        company: "Algorithmics Global",
        location: "Remote",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2026-02-01"),
        description: "Taught Python programming with a focus on game development to 25+ students aged 10-17. Covered control flow, functions, loops, and object-oriented design, supervised 20+ individual game projects, and maintained an average class engagement score of 95% through interactive lessons and personalized support.",
        order: 1,
      },
      {
        role: "Business Intelligence Analyst",
        company: "Wings Group Indonesia (Sayap Mas Utama)",
        location: "Jakarta Timur",
        startDate: new Date("2024-08-01"),
        endDate: new Date("2025-09-01"),
        description: "Developed and enhanced 20+ dynamic dashboards and performance reports across business units. Diagnosed and resolved complex visualization issues, ensuring reporting accuracy. Designed automated data pipelines using SQL across Snowflake, Greenplum, PostgreSQL and Python, reducing manual workload by over 80%. Built reporting automation integrated with Google Sheets and scheduled SQL queries, improving daily reporting efficiency by more than 95%.",
        order: 2,
      },
      {
        role: "Development and Support Specialist (Data)",
        company: "OCBC Indonesia",
        location: "Jakarta Selatan",
        startDate: new Date("2023-03-01"),
        endDate: new Date("2024-07-01"),
        description: "Worked with cross-functional teams and senior management to design, develop, and implement data solutions for 15+ strategic banking initiatives. Used SQL and Microsoft Excel to extract, clean, and analyze data. Improved data accuracy and achieved a 95% on-time resolution rate in the Customer Handling Management system. Designed and automated 5+ reporting frameworks for program performance monitoring.",
        order: 3,
      },
      {
        role: "Learning Mentor - Studi Independen",
        company: "Rakamin Academy",
        location: "Jakarta",
        startDate: new Date("2023-08-01"),
        endDate: new Date("2024-01-01"),
        description: "Mentored 10 students in data science, covering Python programming, SQL, data wrangling, and exploratory data analysis. Reviewed 15+ assignments and provided detailed feedback to strengthen technical understanding and analytical thinking.",
        order: 4,
      },
      {
        role: "Data Analyst",
        company: "Pitik",
        location: "Kota Tangerang, Banten",
        startDate: new Date("2022-05-01"),
        endDate: new Date("2023-03-01"),
        description: "Used Python and spreadsheets to analyze poultry business operations, extract insights, and support decision-making. Developed interactive dashboards using Metabase to monitor operational metrics, supported data ingestion, and implemented data pipelines to improve analysis accuracy and reliability.",
        order: 5,
      },
      {
        role: "Class Coordinator",
        company: "Rakamin Academy",
        location: "Remote",
        startDate: new Date("2022-01-01"),
        endDate: new Date("2023-02-01"),
        description: "Coordinated bootcamp and JAP learning sessions, moderated 65+ sessions, managed participant data and attendance with Microsoft Excel and Google Sheets, and initiated semi-automated task pipelines for learning operations.",
        order: 6,
      },
      {
        role: "Awardee Data Science Bootcamp",
        company: "Rakamin Academy",
        location: "Remote",
        startDate: new Date("2021-12-01"),
        endDate: new Date("2022-04-01"),
        description: "Completed data science bootcamp covering Python, SQL, statistics, data visualization, soft skills, design thinking, and decision making. Built a final machine learning project using e-commerce data to predict customer churn.",
        order: 7,
      },
      {
        role: "Awardee Data Science Bootcamp",
        company: "Data Bangalore",
        location: "Remote",
        startDate: new Date("2021-12-01"),
        endDate: new Date("2022-02-01"),
        description: "Gained practical experience in data analysis and machine learning using KNIME for workflow automation, data preparation, and predictive modeling. Completed a capstone project using Python and KNIME to support Indonesian MSME digital transformation.",
        order: 8,
      },
      {
        role: "Academic Intern",
        company: "ReadyLearn",
        location: "Remote",
        startDate: new Date("2021-10-01"),
        endDate: new Date("2022-01-01"),
        description: "Developed 15+ structured mathematics learning modules for high school students and contributed to 180+ UTBK and Mathematics Olympiad questions with the academic team.",
        order: 9,
      },
      {
        role: "Campus Ambassador",
        company: "Gardata",
        location: "Remote",
        startDate: new Date("2021-09-01"),
        endDate: new Date("2021-10-01"),
        description: "Produced educational content on research methodology and data analytics and established partnerships with 10+ university-based organizations to expand access to applied data learning resources.",
        order: 10,
      },
      {
        role: "Fresh Graduate Academy - Big Data Using Python",
        company: "Digital Talent Scholarship",
        location: "Remote",
        startDate: new Date("2021-07-01"),
        endDate: new Date("2021-09-01"),
        description: "Completed hands-on projects involving machine learning workflows and data handling using Python with datasets of over 9,000 entries. Selected as one of the top participants for PCAP - Certified Associate in Python Programming.",
        order: 11,
      },
      {
        role: "Data Specialist",
        company: "Village Government",
        location: "Pekalongan, Central Java",
        startDate: new Date("2020-07-01"),
        endDate: new Date("2020-08-01"),
        description: "Collected and analyzed 3,000+ population records using Microsoft Excel, created a 10-year population projection, generated population pyramid visualizations, and developed a guidebook for analytical population projections.",
        order: 12,
      },
    ],
  });

  await prisma.project.createMany({
    data: [
      {
        title: "Insight CRM",
        description: "A compact customer relationship dashboard with analytics, notes, and lead tracking.",
        category: "Data Analysis",
        portfolioUrl: "https://example.com",
        repoUrl: "https://github.com",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        tags: ["Next.js", "TypeScript", "Charts"],
        featured: true,
        order: 0,
      },
      {
        title: "Launch Metrics",
        description: "A conversion-focused analytics view for product launches and campaign performance.",
        category: "Data Visualization",
        portfolioUrl: "https://example.com",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        tags: ["React", "Tailwind", "Analytics"],
        featured: true,
        order: 1,
      },
      {
        title: "Portfolio CMS",
        description: "A prototype for managing profile, projects, skills, FAQ, and visitor messages.",
        category: "Web Development",
        portfolioUrl: "https://example.com",
        repoUrl: "https://github.com",
        imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
        tags: ["Next.js", "CMS", "Admin"],
        featured: false,
        order: 2,
      },
      {
        title: "Customer Churn Model",
        description: "A predictive machine learning workflow for identifying churn risk and retention opportunities.",
        category: "Machine Learning",
        portfolioUrl: "https://example.com",
        repoUrl: "https://github.com",
        imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80",
        tags: ["Python", "Scikit-learn", "ML"],
        featured: false,
        order: 3,
      },
      {
        title: "Sales Forecast Lab",
        description: "A data science notebook project for forecasting revenue trends and seasonal demand.",
        category: "Data Science",
        portfolioUrl: "https://example.com",
        imageUrl: "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?auto=format&fit=crop&w=1200&q=80",
        tags: ["Python", "Forecasting", "Pandas"],
        featured: false,
        order: 4,
      },
      {
        title: "Executive KPI Dashboard",
        description: "A visual analytics dashboard for monitoring operational KPIs and performance trends.",
        category: "Data Visualization",
        portfolioUrl: "https://example.com",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        tags: ["BI", "Charts", "Dashboard"],
        featured: false,
        order: 5,
      },
      {
        title: "Market Basket Analysis",
        description: "A data analysis project exploring purchase patterns, product affinity, and campaign opportunities.",
        category: "Data Analysis",
        portfolioUrl: "https://example.com",
        imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
        tags: ["SQL", "Analysis", "Insights"],
        featured: false,
        order: 6,
      },
    ],
  });

  await prisma.faq.createMany({
    data: [
      {
        question: "What kind of data work do you focus on?",
        answer: "I focus on business intelligence dashboards, reporting automation, data pipelines, exploratory analysis, and data-driven business optimization.",
        order: 0,
      },
      {
        question: "Which tools do you commonly use?",
        answer: "I commonly work with SQL, Python, Looker Studio, Tableau, Metabase, MicroStrategy, Google Sheets, Excel, Snowflake, Greenplum, and PostgreSQL.",
        order: 1,
      },
      {
        question: "Are you available for collaboration?",
        answer: "Yes, I am open to selected data analytics, dashboarding, reporting automation, and BI collaboration opportunities.",
        order: 2,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
