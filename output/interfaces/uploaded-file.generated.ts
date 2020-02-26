/**
 * Autogenerated interface, DO NOT MODIFY
 */
/* tslint:disable */
import { UPLOAD_PARENT_TYPE } from "../enums/upload-parent-type.generated"
import { CONTENT_TYPE } from "../enums/content-type.generated"
export interface IUploadedFile {
  fileId?: number;
  createdAt?: Date;
  createdBy?: string;
  municipality?: string;
  filename?: string;
  originalName?: string;
  deleted?: Date;
  uploadParentId?: string;
  uploadParentType?: UPLOAD_PARENT_TYPE;
  contentType?: CONTENT_TYPE;
  bucket?: string;
  path?: string;
  mimeType?: string;
  size?: number;
}
