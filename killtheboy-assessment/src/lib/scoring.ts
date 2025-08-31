export type Domain =
  | "identity"
  | "health"
  | "finances"
  | "relationships"
  | "emotions"
  | "focus";

export type Avatar = "Drifter" | "Balancer" | "Architect";

export const TIE_BREAK_ORDER: Domain[] = [
  "identity","health","finances","relationships","emotions","focus"
];

export function computeDomainAverages(answers: Record<string, number>, qmap: Record<string, Domain>): Record<Domain, number> {
  // average per domain (answers are 1..5)
  const byDomain: Record<Domain, number[]> = {
    identity: [], health: [], finances: [], relationships: [], emotions: [], focus: []
  };
  for (const [qid, val] of Object.entries(answers)) {
    const d = qmap[qid];
    if (d) byDomain[d].push(val);
  }
  return Object.fromEntries(
    Object.entries(byDomain).map(([d, arr]) => [d, arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 0])
  ) as Record<Domain, number>;
}

export function overallAverage(domainAverages: Record<Domain, number>): number {
  const vals = Object.values(domainAverages);
  return vals.reduce((a,b)=>a+b,0) / vals.length;
}

// Placeholders; exact thresholds/labels come from PDFs in Phase 2
export function avatarFromOverall(overall: number): Avatar {
  // Drifter 1.0–3.1, Balancer 3.2–4.1, Architect 4.2–5.0 (per project rules)
  if (overall <= 3.1) return "Drifter";
  if (overall <= 4.1) return "Balancer";
  return "Architect";
}

export function lowestTwoDomains(avg: Record<Domain, number>): [Domain, Domain] {
  const sorted = Object.entries(avg).sort((a,b)=>a[1]-b[1] || TIE_BREAK_ORDER.indexOf(a[0] as Domain) - TIE_BREAK_ORDER.indexOf(b[0] as Domain));
  return [sorted[0][0] as Domain, sorted[1][0] as Domain];
}

export function labelForScore(x: number): "Unacceptable" | "Acceptable" | "Desirable" {
  if (x <= 3.1) return "Unacceptable";
  if (x <= 4.1) return "Acceptable";
  return "Desirable";
}
