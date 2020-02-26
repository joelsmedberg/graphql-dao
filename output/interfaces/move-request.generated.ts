/**
 * Autogenerated interface, DO NOT MODIFY
 */
/* tslint:disable */
import { MOVE_REQUEST_STATUS } from "../enums/move-request-status.generated"
export interface IMoveRequest {
  moveRequestId?: number;
  createdAt?: Date;
  createdBy?: string;
  manualInput?: boolean;
  placementRoundId?: number;
  studentSsn?: string;
  fileId?: number;
  coAddress?: string;
  address?: string;
  zipcode?: string;
  city?: string;
  moveRequestStatus?: MOVE_REQUEST_STATUS;
  handledBy?: string;
  userComment?: string;
  canceled?: Date;
}
