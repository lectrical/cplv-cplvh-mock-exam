import { dangersQuestions } from "./dangers.js";
import { regulationsQuestions } from "./regulations.js";
import { documentationQuestions } from "./documentation.js";
import { safeIsolationQuestions } from "./safe-isolation.js";
import { liveWorkingQuestions } from "./live-working.js";
import { reEnergisationQuestions } from "./re-energisation.js";
import { cplvSpecificQuestions } from "./cplv-specific.js";
import { cplvhSpecificQuestions } from "./cplvh-specific.js";

const SHARED = [
  ...dangersQuestions,
  ...regulationsQuestions,
  ...documentationQuestions,
  ...safeIsolationQuestions,
  ...liveWorkingQuestions,
  ...reEnergisationQuestions
];

export function getQuestionBank(track) {
  return track === "cplvh"
    ? [...SHARED, ...cplvhSpecificQuestions]
    : [...SHARED, ...cplvSpecificQuestions];
}
