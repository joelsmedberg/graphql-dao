/**
 * Autogenerated interface, DO NOT MODIFY
 */
/* tslint:disable */
import { GraphDao } from "./graph-dao";
import { IViewLatestMoveRequest } from "./interfaces/view-latest-move-request.generated"; 
import { IMoveRequest } from "./interfaces/move-request.generated"; 
import { IUploadInputType } from "./interfaces/upload-input-type.generated"; 

export class MoveRequestDao extends GraphDao {
    
    /**
     * Returns only the currently active move requests for a student
     * */
    public getLatestForStudent = (placementRoundId: number, studentSsn: string): Promise<IViewLatestMoveRequest> => {
        const query = `query moveRequest_getLatestForStudent($placementRoundId: Int, $studentSsn: String) {
    moveRequest_getLatestForStudent(placementRoundId: $placementRoundId, studentSsn: $studentSsn)
     { moveRequestId
 createdAt
 createdBy
 manualInput
 placementRoundId
 studentSsn
 fileId
 coAddress
 address
 zipcode
 city
 handledBy
 userComment
 canceled
 userFirstName
 userLastName
 creatingUserFirstName
 creatingUserLastName
 phone
 email
 parentFirstName
 parentLastName
 studentFirstName
 studentLastName
 municipality moveRequestStatus } 
}`;
        return this.post({ query, variables: { placementRoundId: placementRoundId,studentSsn: studentSsn } });
    }

    
    /**
     * Returns only the currently active move requests
     * */
    public listLatestMoveRequests = (): Promise<IViewLatestMoveRequest[]> => {
        const query = `query moveRequest_listLatestMoveRequests {
    moveRequest_listLatestMoveRequests
     { moveRequestId
 createdAt
 createdBy
 manualInput
 placementRoundId
 studentSsn
 fileId
 coAddress
 address
 zipcode
 city
 handledBy
 userComment
 canceled
 userFirstName
 userLastName
 creatingUserFirstName
 creatingUserLastName
 phone
 email
 parentFirstName
 parentLastName
 studentFirstName
 studentLastName
 municipality moveRequestStatus } 
}`;
        return this.post({ query, variables: {  } });
    }

    
    /**
     * Changes a move request to status approved
     * */
    public approve = (moveRequestId: number): Promise<void> => {
        const query = `mutation moveRequest_approve($moveRequestId: Int) {
    moveRequest_approve(moveRequestId: $moveRequestId)
     { undefined } 
}`;
        return this.post({ query, variables: { moveRequestId: moveRequestId } });
    }

    
    /**
     * Create a new move request and returns it
     * */
    public createNew = (moveRequest: IMoveRequest): Promise<IMoveRequest> => {
        const query = `mutation moveRequest_createNew($moveRequest: MoveRequestInput) {
    moveRequest_createNew(moveRequest: $moveRequest)
     { moveRequestId
 createdAt
 createdBy
 manualInput
 placementRoundId
 studentSsn
 fileId
 coAddress
 address
 zipcode
 city
 handledBy
 userComment
 canceled moveRequestStatus } 
}`;
        return this.post({ query, variables: { moveRequest: moveRequest } });
    }

    
    /**
     * Changes a move request to status declined
     * */
    public decline = (moveRequestId: number): Promise<void> => {
        const query = `mutation moveRequest_decline($moveRequestId: Int) {
    moveRequest_decline(moveRequestId: $moveRequestId)
     { undefined } 
}`;
        return this.post({ query, variables: { moveRequestId: moveRequestId } });
    }

    
    /**
     * Add a file to uploaded moveRequest, file content should be in base64, returns file id
     * */
    public uploadDocument = (file: IUploadInputType, moveRequestId: number, studentSsn: string, placementRoundId: number): Promise<number> => {
        const query = `mutation moveRequest_uploadDocument($file: UploadInputType, $moveRequestId: Int, $studentSsn: String, $placementRoundId: Int) {
    moveRequest_uploadDocument(file: $file, moveRequestId: $moveRequestId, studentSsn: $studentSsn, placementRoundId: $placementRoundId)
     { undefined } 
}`;
        return this.post({ query, variables: { file: file,moveRequestId: moveRequestId,studentSsn: studentSsn,placementRoundId: placementRoundId } });
    }

}