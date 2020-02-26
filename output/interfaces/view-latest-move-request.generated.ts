/**
 * Autogenerated interface, DO NOT MODIFY
 */
/* tslint:disable */
import { MOVE_REQUEST_STATUS } from "../enums/move-request-status.generated"
export interface IViewLatestMoveRequest {
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
  userFirstName?: string;
  userLastName?: string;
  creatingUserFirstName?: string;
  creatingUserLastName?: string;
  phone?: string;
  email?: string;
  parentFirstName?: string;
  parentLastName?: string;
  studentFirstName?: string;
  studentLastName?: string;
  municipality?: string;
}
