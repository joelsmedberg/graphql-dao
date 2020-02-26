/**
 * Autogenerated interface, DO NOT MODIFY
 */
/* tslint:disable */
import { GraphDao } from "./graph-dao";
import { IViewOptOut } from "./interfaces/view-opt-out.generated"; 
import { IOptOut } from "./interfaces/opt-out.generated"; 

export class OptoutDao extends GraphDao {
    
    /**
     * Get opt out if any for a student
     * */
    public getForStudent = (placementRoundId: number, studentSsn: string): Promise<IViewOptOut> => {
        const query = `query optout_getForStudent($placementRoundId: Int, $studentSsn: String) {
    optout_getForStudent(placementRoundId: $placementRoundId, studentSsn: $studentSsn)
     { placementRoundId
 studentSsn
 createdAt
 createdBy
 canceled
 parent1Approved
 parent2Approved
 manuallyApprovedBy
 schoolMunicipality
 schoolName
 municipality
 studentFirstName
 studentLastName
 parentCount
 parentApprovals
 isApproved optOutType } 
}`;
        return this.post({ query, variables: { placementRoundId: placementRoundId,studentSsn: studentSsn } });
    }

    
    /**
     * List all opt outs
     * */
    public listAll = (): Promise<IViewOptOut[]> => {
        const query = `query optout_listAll {
    optout_listAll
     { placementRoundId
 studentSsn
 createdAt
 createdBy
 canceled
 parent1Approved
 parent2Approved
 manuallyApprovedBy
 schoolMunicipality
 schoolName
 municipality
 studentFirstName
 studentLastName
 parentCount
 parentApprovals
 isApproved optOutType } 
}`;
        return this.post({ query, variables: {  } });
    }

    
    /**
     * Insert a new optout, must include type
     * */
    public insertOptOut = (optOut: IOptOut): Promise<void> => {
        const query = `mutation optout_insertOptOut($optOut: OptOutInput) {
    optout_insertOptOut(optOut: $optOut)
     { undefined } 
}`;
        return this.post({ query, variables: { optOut: optOut } });
    }

    
    /**
     * Insert a new optout, must include type
     * */
    public manuallyApprove = (placementRoundId: number, studentSsn: string): Promise<void> => {
        const query = `mutation optout_manuallyApprove($placementRoundId: Int, $studentSsn: String) {
    optout_manuallyApprove(placementRoundId: $placementRoundId, studentSsn: $studentSsn)
     { undefined } 
}`;
        return this.post({ query, variables: { placementRoundId: placementRoundId,studentSsn: studentSsn } });
    }

    
    /**
     * Insert a new optout, must include type
     * */
    public removeManualApproval = (placementRoundId: number, studentSsn: string): Promise<void> => {
        const query = `mutation optout_removeManualApproval($placementRoundId: Int, $studentSsn: String) {
    optout_removeManualApproval(placementRoundId: $placementRoundId, studentSsn: $studentSsn)
     { undefined } 
}`;
        return this.post({ query, variables: { placementRoundId: placementRoundId,studentSsn: studentSsn } });
    }

}
