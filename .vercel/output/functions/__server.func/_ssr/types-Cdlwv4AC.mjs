//#region node_modules/.nitro/vite/services/ssr/assets/types-Cdlwv4AC.js
function avgDim(scores) {
	const dims = Object.values(scores).filter((v) => typeof v === "object" && v !== null && "score" in v);
	if (!dims.length) return 0;
	return Math.round(dims.reduce((a, d) => a + d.score, 0) / dims.length);
}
function firstReason(scores) {
	for (const v of Object.values(scores)) if (v?.reasoning) return v.reasoning;
	return "";
}
function mapApiProposal(p) {
	const flagged = p.red_flags.length > 0;
	let status = p.status;
	if (p.status === "complete") status = flagged ? "flagged" : "approved";
	return {
		id: p.id,
		evaluationId: p.evaluation_id,
		title: p.title,
		organization: p.team_summary?.slice(0, 80) ?? "",
		amountKas: 0,
		status,
		overallScore: p.total_score ?? 0,
		scores: [
			{
				agent: "technical",
				score: avgDim(p.technical_scores),
				confidence: .85,
				reasoning: firstReason(p.technical_scores)
			},
			{
				agent: "impact",
				score: avgDim(p.impact_scores),
				confidence: .85,
				reasoning: firstReason(p.impact_scores)
			},
			{
				agent: "team",
				score: avgDim(p.team_scores),
				confidence: .85,
				reasoning: firstReason(p.team_scores)
			}
		],
		summary: p.objectives ?? p.team_summary ?? "",
		submittedAt: p.evaluated_at ?? (/* @__PURE__ */ new Date()).toISOString()
	};
}
function mapResultProposal(p, evaluationId) {
	const flagged = p.red_flags.length > 0;
	return {
		id: p.id,
		evaluationId,
		title: p.title,
		organization: "",
		amountKas: 0,
		status: flagged ? "flagged" : "approved",
		overallScore: p.total_score,
		scores: [
			{
				agent: "technical",
				score: avgDim(p.technical_scores),
				confidence: .85,
				reasoning: ""
			},
			{
				agent: "impact",
				score: avgDim(p.impact_scores),
				confidence: .85,
				reasoning: ""
			},
			{
				agent: "team",
				score: avgDim(p.team_scores),
				confidence: .85,
				reasoning: ""
			}
		],
		summary: "",
		submittedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
//#endregion
export { mapResultProposal as n, mapApiProposal as t };
