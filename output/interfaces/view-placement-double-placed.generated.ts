/**
 * Autogenerated interface, DO NOT MODIFY
 */
/* tslint:disable */
import { PLACEMENT_STATUS } from "../enums/placement-status.generated"
import { APPROVED_PARENT1 } from "../enums/approved-parent1.generated"
import { APPROVED_PARENT2 } from "../enums/approved-parent2.generated"
export interface IViewPlacementDoublePlaced {
  studentSsn?: string;
  placementIndex?: number;
  createdAt?: Date;
  schoolMunicipality?: string;
  schoolName?: string;
  schoolProgram?: string;
  placementStatus?: PLACEMENT_STATUS;
  approvedParent1?: APPROVED_PARENT1;
  approvedParent2?: APPROVED_PARENT2;
  manuallyApprovedBy?: string;
  firstName?: string;
  lastName?: string;
  currentGrade?: number;
  doulbePlaced?: number;
}
