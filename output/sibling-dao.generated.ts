/**
 * Autogenerated interface, DO NOT MODIFY
 */
/* tslint:disable */
import { GraphDao } from "./graph-dao";
import { ISibling } from "./interfaces/sibling.generated"; 

export class SiblingDao extends GraphDao {
    
    /**
     * List all siblings in users municipality
     * */
    public listAll = (): Promise<ISibling[]> => {
        const query = `query sibling_listAll {
    sibling_listAll
     { undefined } 
}`;
        return this.post({ query, variables: {  } });
    }

    
    /**
     * List all siblings associated with a student, requires operator right
     * */
    public listForStudent = (placementRoundId: number, studentSsn: string): Promise<ISibling[]> => {
        const query = `query sibling_listForStudent($placementRoundId: Int, $studentSsn: String) {
    sibling_listForStudent(placementRoundId: $placementRoundId, studentSsn: $studentSsn)
     { undefined } 
}`;
        return this.post({ query, variables: { placementRoundId: placementRoundId,studentSsn: studentSsn } });
    }

    
    /**
     * Send in a list of siblings and check which ones are in db
     * */
    public validateSiblingList = (siblings: ISibling[]): Promise<ISibling[]> => {
        const query = `query sibling_validateSiblingList($siblings: [SiblingInput]) {
    sibling_validateSiblingList(siblings: $siblings)
     { undefined } 
}`;
        return this.post({ query, variables: { siblings: siblings } });
    }

    
    /**
     * Approve an application
     * */
    public approveSibling = (placementRoundId: number, siblingSsn: string, studentSsn: string): Promise<void> => {
        const query = `mutation sibling_approveSibling($placementRoundId: Int, $siblingSsn: String, $studentSsn: String) {
    sibling_approveSibling(placementRoundId: $placementRoundId, siblingSsn: $siblingSsn, studentSsn: $studentSsn)
     { undefined } 
}`;
        return this.post({ query, variables: { placementRoundId: placementRoundId,siblingSsn: siblingSsn,studentSsn: studentSsn } });
    }

    
    /**
     * Creates new siblings, fails if siblings already exists. Requires operator rights
     * */
    public bulkInsertSiblings = (siblings: ISibling[]): Promise<void> => {
        const query = `mutation sibling_bulkInsertSiblings($siblings: [SiblingInput]) {
    sibling_bulkInsertSiblings(siblings: $siblings)
     { undefined } 
}`;
        return this.post({ query, variables: { siblings: siblings } });
    }

    
    /**
     * Decline an application
     * */
    public declineSibling = (placementRoundId: number, siblingSsn: string, studentSsn: string): Promise<void> => {
        const query = `mutation sibling_declineSibling($placementRoundId: Int, $siblingSsn: String, $studentSsn: String) {
    sibling_declineSibling(placementRoundId: $placementRoundId, siblingSsn: $siblingSsn, studentSsn: $studentSsn)
     { undefined } 
}`;
        return this.post({ query, variables: { placementRoundId: placementRoundId,siblingSsn: siblingSsn,studentSsn: studentSsn } });
    }

    
    /**
     * Create a new siblign in the db
     * */
    public insertSibling = (sibling: ISibling): Promise<void> => {
        const query = `mutation sibling_insertSibling($sibling: SiblingInput) {
    sibling_insertSibling(sibling: $sibling)
     { undefined } 
}`;
        return this.post({ query, variables: { sibling: sibling } });
    }

}