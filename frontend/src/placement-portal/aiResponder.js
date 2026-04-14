import { MOCK_SENIORS } from './mockSeniors';

/** Lightweight “AI” answers from portal knowledge (no external API). */
export function getPlacementAiReply(question) {
  const q = (question || '').toLowerCase().trim();
  if (!q) return 'Ask anything about interviews, companies, or prep — I use senior tips from this portal.';

  if (q.includes('google') && (q.includes('round') || q.includes('interview'))) {
    const g = MOCK_SENIORS.find((s) => s.company === 'Google');
    const n = g?.rounds?.length || 5;
    return `Based on seniors placed at Google (${g?.name || 'our alumni'}), expect around **${n} stages**: online assessment, technical screens, virtual onsite (often 2 DSA + design discussion), Googliness, and team match. Tip from the portal: "${g?.tips?.slice(0, 120) || 'Prepare STAR stories and mock interviews.'}…"`;
  }

  if (q.includes('amazon') && (q.includes('round') || q.includes('lp') || q.includes('leadership'))) {
    const a = MOCK_SENIORS.find((s) => s.company === 'Amazon');
    return `Amazon loop typically includes OA, 2+ coding rounds, and a bar raiser focused on **Leadership Principles**. ${a?.name || 'A senior'} notes: "${a?.tips || 'Rehearse LP stories with metrics.'}"`;
  }

  if (q.includes('off') && q.includes('campus')) {
    return '**Off-campus** hires often need stronger outreach: polish LinkedIn, cold-email recruiters with a crisp hook, and tailor resumes per role. See **Priya Gupta**’s profile for Razorpay off-campus notes in this portal.';
  }

  if (q.includes('referral') || q.includes('refer')) {
    return 'Use **Request Referral** on a senior’s profile. Your note should mention their company, role, and why you’re a fit — seniors see requests only in their **Referral Inbox** on the same portal.';
  }

  if (q.includes('sql') || q.includes('data')) {
    return 'For analytics / PA roles, seniors recommend **daily SQL** (joins, window functions, metrics). Check Razorpay senior tips in the feed for a concrete round breakdown.';
  }

  const hit = MOCK_SENIORS.find(
    (s) =>
      q.includes(s.company.toLowerCase()) ||
      q.includes(s.role.toLowerCase().split(' ')[0]),
  );
  if (hit) {
    return `Here’s what **${hit.name}** (${hit.company}, ${hit.role}) shared: ${hit.tips} They listed **${hit.rounds.length}** interview stages — open their profile for the full breakdown and resources.`;
  }

  return `I don’t have a company-specific match for that yet. Try searching the senior grid by **company** or **role**, or ask about **Google rounds**, **Amazon LP**, **off-campus**, or **referrals** — I summarize portal knowledge from alumni profiles.`;
}
