/**
 * Autogenerated interface, DO NOT MODIFY
 */
/* tslint:disable */
import { OPT_OUT_TYPE } from "../enums/opt-out-type.generated"
export interface IOptOut {
  placementRoundId?: number;
  studentSsn?: string;
  createdAt?: Date;
  createdBy?: string;
  canceled?: Date;
  parent1Approved?: Date;
  parent2Approved?: Date;
  manuallyApprovedBy?: string;
  optOutType?: OPT_OUT_TYPE;
  schoolMunicipality?: string;
  schoolName?: string;
}
