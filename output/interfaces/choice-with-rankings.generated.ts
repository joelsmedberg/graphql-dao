/**
 * Autogenerated interface, DO NOT MODIFY
 */
/* tslint:disable */
import { IChoiceRanking } from "./choice-ranking.generated"
export interface IChoiceWithRankings {
  afterSchool?: string;
  approvedParent1?: Date;
  approvedParent2?: Date;
  choiceId?: number;
  createdAt?: Date;
  createdBy?: string;
  language?: string;
  manualInput?: boolean;
  manuallyApprovedBy?: string;
  placementRoundId?: number;
  rankings?: IChoiceRanking;
  studentFirstName?: string;
  studentLastName?: string;
  studentSsn?: string;
}
