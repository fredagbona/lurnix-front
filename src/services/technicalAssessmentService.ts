import { apiClient } from "./api";
import type {
  TechnicalAssessmentResponse,
  TechnicalAssessmentSubmitInput,
  TechnicalAssessmentSubmitResponse,
} from "@/models";

const QUESTIONS_ENDPOINT = "/assessments/technical/questions";
const SUBMIT_ENDPOINT = "/assessments/technical/submit";

type Envelope<T> = { success: boolean; data: T };

type AssessmentFetchResponse = TechnicalAssessmentResponse | Envelope<TechnicalAssessmentResponse>;

type AssessmentSubmitResponse =
  | TechnicalAssessmentSubmitResponse
  | Envelope<TechnicalAssessmentSubmitResponse>;

function unwrapEnvelope<T>(response: T | Envelope<T>): T {
  if (response && typeof response === "object" && "success" in response && "data" in response) {
    return (response as Envelope<T>).data;
  }
  return response as T;
}

export const technicalAssessmentService = {
  async getAssessment(): Promise<TechnicalAssessmentResponse> {
    const response = await apiClient.get<AssessmentFetchResponse>(QUESTIONS_ENDPOINT);
    return unwrapEnvelope(response);
  },

  async submitAssessment(
    payload: TechnicalAssessmentSubmitInput,
  ): Promise<TechnicalAssessmentSubmitResponse> {
    const response = await apiClient.post<AssessmentSubmitResponse>(SUBMIT_ENDPOINT, payload);
    return unwrapEnvelope(response);
  },
};
