/**
 * Autogenerated interface, DO NOT MODIFY
 */
/* tslint:disable */
import { GraphDao } from "./graph-dao";
import { IViewParent } from "./interfaces/view-parent.generated"; 
import { IViewParentContactDetails } from "./interfaces/view-parent-contact-details.generated"; 
import { IViewMissingParent } from "./interfaces/view-missing-parent.generated"; 
import { IViewParentInconsistency } from "./interfaces/view-parent-inconsistency.generated"; 
import { IParent } from "./interfaces/parent.generated"; 
import { IParentContactDetail } from "./interfaces/parent-contact-detail.generated"; 

export class ParentDao extends GraphDao {
    
    /**
     * Get parent for parentSsn, requires operator right
     * */
    public getParent = (parentSsn: string): Promise<IViewParent> => {
        const query = `query parent_getParent($parentSsn: String) {
    parent_getParent(parentSsn: $parentSsn)
     { parentSsn
 createdAt
 firstName
 lastName
 coAddress
 address
 zipcode
 city
 email
 phone
 municipality } 
}`;
        return this.post({ query, variables: { parentSsn: parentSsn } });
    }

    
    /**
     * Returns array, containing parents and contact details, requires operator right
     * */
    public getParentsForStudent = (studentSsn: string): Promise<IViewParentContactDetails[]> => {
        const query = `query parent_getParentsForStudent($studentSsn: String) {
    parent_getParentsForStudent(studentSsn: $studentSsn)
     { parentSsn
 createdAt
 createdBy
 firstName
 lastName
 coAddress
 address
 zipcode
 city
 addressMunicipality
 municipality
 phone
 email parentCreatedVia } 
}`;
        return this.post({ query, variables: { studentSsn: studentSsn } });
    }

    
    /**
     * Lists ssn of parents that needs to be looked up
     * */
    public listMissingParents = (): Promise<IViewMissingParent[]> => {
        const query = `query parent_listMissingParents {
    parent_listMissingParents
     { parent
 municipality
 studentSsn } 
}`;
        return this.post({ query, variables: {  } });
    }

    
    /**
     * List parents where users or students don&#x27;t match municipality
     * */
    public listParentInconsistencies = (): Promise<IViewParentInconsistency[]> => {
        const query = `query parent_listParentInconsistencies {
    parent_listParentInconsistencies
     { parentSsn
 studentSsn
 studentMunicipality
 userSsn
 userMunicipality } 
}`;
        return this.post({ query, variables: {  } });
    }

    
    /**
     * Returns array with all Parents, requires operator right
     * */
    public listParents = (): Promise<IParent[]> => {
        const query = `query parent_listParents {
    parent_listParents
     { undefined } 
}`;
        return this.post({ query, variables: {  } });
    }

    
    /**
     * Send in a list of ssn and check which ones are in db. Requires operator rights
     * */
    public validateSsnList = (ssnList: string[]): Promise<string[]> => {
        const query = `query parent_validateSsnList($ssnList: [String]) {
    parent_validateSsnList(ssnList: $ssnList)
     { undefined } 
}`;
        return this.post({ query, variables: { ssnList: ssnList } });
    }

    
    /**
     * Parent SSN may not exist already, requires operator right
     * */
    public addParentForMunicipality = (municipality: string, parentSsn: string): Promise<IParent> => {
        const query = `mutation parent_addParentForMunicipality($municipality: String, $parentSsn: String) {
    parent_addParentForMunicipality(municipality: $municipality, parentSsn: $parentSsn)
     { undefined } 
}`;
        return this.post({ query, variables: { municipality: municipality,parentSsn: parentSsn } });
    }

    
    /**
     * Parent SSN may not exist already, requires operator right
     * */
    public addParentForUserMunicipality = (parentSsn: string): Promise<IParent> => {
        const query = `mutation parent_addParentForUserMunicipality($parentSsn: String) {
    parent_addParentForUserMunicipality(parentSsn: $parentSsn)
     { undefined } 
}`;
        return this.post({ query, variables: { parentSsn: parentSsn } });
    }

    
    /**
     * Bulk upload contact details. municipality is taken from user session
     * */
    public bulkAddContactDetail = (contactDetails: IParentContactDetail[]): Promise<void> => {
        const query = `mutation parent_bulkAddContactDetail($contactDetails: [ParentContactDetailInput]) {
    parent_bulkAddContactDetail(contactDetails: $contactDetails)
     { undefined } 
}`;
        return this.post({ query, variables: { contactDetails: contactDetails } });
    }

    
    /**
     * Creates a new parents, fails if student already exists. Requires operator rights
     * */
    public bulkCreateNew = (parents: IParent[]): Promise<void> => {
        const query = `mutation parent_bulkCreateNew($parents: [ParentInput]) {
    parent_bulkCreateNew(parents: $parents)
     { undefined } 
}`;
        return this.post({ query, variables: { parents: parents } });
    }

    
    /**
     * Bulk upload contact details. municipality is taken from user session
     * */
    public bulkSoftUpdateContactDetail = (contactDetails: IParentContactDetail[]): Promise<void> => {
        const query = `mutation parent_bulkSoftUpdateContactDetail($contactDetails: [ParentContactDetailInput]) {
    parent_bulkSoftUpdateContactDetail(contactDetails: $contactDetails)
     { undefined } 
}`;
        return this.post({ query, variables: { contactDetails: contactDetails } });
    }

}