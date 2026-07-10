import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' });

  try {
    const sql = neon(process.env.DATABASE_URL);
    const { goals, sales } = req.body;

    // Upsert goals
    // Key format: "personId-lineId-year" → value is annual_amount
    if (goals && typeof goals === 'object') {
      for (const [key, amount] of Object.entries(goals)) {
        const parts = key.split('-');
        // e.g. "claudio-vida-year"
        const personId = parts[0];
        const lineId = parts[1];
        if (personId && lineId && Number(amount) > 0) {
          await sql`
            INSERT INTO goals (id, person_id, line_id, annual_amount, updated_at)
            VALUES (${key}, ${personId}, ${lineId}, ${Number(amount)}, now())
            ON CONFLICT (id)
            DO UPDATE SET annual_amount = ${Number(amount)}, updated_at = now()
          `;
        }
      }
    }

    // Upsert sales
    // Key format: "personId-lineId-mMONTH-wWEEK" → value is amount
    if (sales && typeof sales === 'object') {
      for (const [key, amount] of Object.entries(sales)) {
        // e.g. "claudio-vida-m5-w2"
        const match = key.match(/^(.+?)-(.+?)-m(\d+)-w(\d+)$/);
        if (match && Number(amount) !== 0) {
          const [, personId, lineId, monthStr, weekStr] = match;
          await sql`
            INSERT INTO sales (id, person_id, line_id, month, week, amount, updated_at)
            VALUES (${key}, ${personId}, ${lineId}, ${Number(monthStr)}, ${Number(weekStr)}, ${Number(amount)}, now())
            ON CONFLICT (id)
            DO UPDATE SET amount = ${Number(amount)}, updated_at = now()
          `;
        }
      }
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ error: error.message });
  }
}
