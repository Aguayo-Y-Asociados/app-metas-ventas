import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const sql = neon(process.env.DATABASE_URL);

    const goals = await sql`SELECT * FROM goals`;
    const sales = await sql`SELECT * FROM sales`;

    // Convert to the flat object format the app expects
    const goalsObj = {};
    goals.forEach((g) => {
      goalsObj[g.id] = Number(g.annual_amount);
    });

    const salesObj = {};
    sales.forEach((s) => {
      salesObj[s.id] = Number(s.amount);
    });

    res.status(200).json({ goals: goalsObj, sales: salesObj });
  } catch (error) {
    console.error('Load error:', error);
    res.status(500).json({ error: error.message });
  }
}
