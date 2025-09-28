// Event logging helpers for local console logging

export function logAssessmentStart() {
  console.log('assessment_start');
}

export function logQuestionAnswered(qid: string, value: number) {
  console.log('question_answered', { qid, value });
}

export function logAssessmentComplete(overall: number, avatar: string, lowestDomains: string[]) {
  console.log('assessment_complete', { overall, avatar, lowestDomains });
}

export function logLeadSubmit(submissionId: string, email: string) {
  console.log('lead_submit', { submissionId, email });
}
