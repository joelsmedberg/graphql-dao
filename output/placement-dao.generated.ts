/**
 * Autogenerated interface, DO NOT MODIFY
 */
/* tslint:disable */
import { GraphDao } from "./graph-dao";
import { IViewParticipantWithPlacements } from "./interfaces/view-participant-with-placements.generated"; 
import { IViewPlacementWithParentCount } from "./interfaces/view-placement-with-parent-count.generated"; 
import { IViewPlacementDoublePlaced } from "./interfaces/view-placement-double-placed.generated"; 
import { IPlacement } from "./interfaces/placement.generated"; 
import { IPriorityGround } from "./interfaces/priority-ground.generated"; 

export class PlacementDao extends GraphDao {
    
    /**
     * returns all placement
     * */
    public listParticipantWithPlacements = (): Promise<IViewParticipantWithPlacements[]> => {
        const query = `query placement_listParticipantWithPlacements {
    placement_listParticipantWithPlacements
     { placementRoundId
 studentSsn
 schoolTransportSchool
 schoolTransportProgram
 catchmentSchool
 catchmentProgram
 currentGrade
 placingGrade
 inSpecialAdmissionRegion
 isNewlyArrived
 currentSchoolMunicipality
 currentSchoolName
 currentSchoolProgram
 currentPreSchoolMunicipality
 currentPreSchool
 placementAddress
 placementZipcode
 placementCity
 placementAddressMunicipality
 placementLat
 placementLng
 limitedParticipation
 municipalityCaseId
 isVoucherSchoolOnly
 municipality
 firstName
 lastName
 placementIndex
 createdAt
 schoolMunicipality
 schoolName
 schoolProgram
 manuallyApprovedBy
 expires
 priorityGroup
 priorityGroupDescription
 hasSiblingPriority
 hasCompleteChoice
 distance
 relativeDistance
 alternativeSchool
 distanceAlternativeSchool
 lotteryNumberSimple
 distanceCutOff
 priorityScore
 currrentPreSchool
 appealNumber participantType placementStatus approvedParent1 approvedParent2 } 
}`;
        return this.post({ query, variables: {  } });
    }

    
    /**
     * returns all placement
     * */
    public listPlacementsForRound = (placementRoundId: number): Promise<IViewPlacementWithParentCount[]> => {
        const query = `query placement_listPlacementsForRound($placementRoundId: Int) {
    placement_listPlacementsForRound(placementRoundId: $placementRoundId)
     { placementRoundId
 studentSsn
 placementIndex
 createdAt
 schoolMunicipality
 schoolName
 schoolProgram
 manuallyApprovedBy
 expires
 priorityGroup
 priorityGroupDescription
 hasSiblingPriority
 hasCompleteChoice
 distance
 relativeDistance
 alternativeSchool
 distanceAlternativeSchool
 lotteryNumberSimple
 distanceCutOff
 priorityScore
 currrentPreSchool
 appealNumber
 parentCount
 firstName
 lastName
 parent1Email
 parent2Email
 placingGrade
 currentSchoolMunicipality
 currentSchoolName
 currentSchoolProgram
 currentPreSchoolMunicipality
 currentPreSchool
 placementAddress
 placementZipcode
 placementCity
 placementAddressMunicipality
 municipalityCaseId
 address
 zipcode
 city
 addressMunicipality
 choice1Program
 choice2Program
 choice3Program placementStatus approvedParent1 approvedParent2 participantType } 
}`;
        return this.post({ query, variables: { placementRoundId: placementRoundId } });
    }

    
    /**
     * returns all placement for a student
     * */
    public listPlacementsForSchool = (schoolMunicipality: string, schoolName: string): Promise<IViewPlacementDoublePlaced[]> => {
        const query = `query placement_listPlacementsForSchool($schoolMunicipality: String, $schoolName: String) {
    placement_listPlacementsForSchool(schoolMunicipality: $schoolMunicipality, schoolName: $schoolName)
     { studentSsn
 placementIndex
 createdAt
 schoolMunicipality
 schoolName
 schoolProgram
 manuallyApprovedBy
 firstName
 lastName
 currentGrade
 doulbePlaced placementStatus approvedParent1 approvedParent2 } 
}`;
        return this.post({ query, variables: { schoolMunicipality: schoolMunicipality,schoolName: schoolName } });
    }

    
    /**
     * returns all placement for a student
     * */
    public listPlacementsForStudent = (placementRoundId: number, studentSsn: string): Promise<IPlacement[]> => {
        const query = `query placement_listPlacementsForStudent($placementRoundId: Int, $studentSsn: String) {
    placement_listPlacementsForStudent(placementRoundId: $placementRoundId, studentSsn: $studentSsn)
     { undefined } 
}`;
        return this.post({ query, variables: { placementRoundId: placementRoundId,studentSsn: studentSsn } });
    }

    
    /**
     * returns all priority grounds for users latest mun round
     * */
    public listPriorityGrounds = (): Promise<IPriorityGround[]> => {
        const query = `query placement_listPriorityGrounds {
    placement_listPriorityGrounds
     { placementRoundId
 studentSsn
 schoolProgram
 grade
 schoolMunicipality
 priorityGroup
 priorityGroupDescription
 hasSiblingPriority
 hasCompleteChoice
 distance
 relativeDistance
 alternativeSchool
 distanceAlternativeSchool
 lotteryNumberSimple
 createdAt
 distanceCutOff
 isEligible
 rank
 rankGroup
 rankGroupDescription
 rankLength } 
}`;
        return this.post({ query, variables: {  } });
    }

    
    /**
     * returns all placement for a student
     * */
    public listQueuedForSchool = (schoolMunicipality: string, schoolName: string): Promise<IViewParticipantWithPlacements[]> => {
        const query = `query placement_listQueuedForSchool($schoolMunicipality: String, $schoolName: String) {
    placement_listQueuedForSchool(schoolMunicipality: $schoolMunicipality, schoolName: $schoolName)
     { placementRoundId
 studentSsn
 schoolTransportSchool
 schoolTransportProgram
 catchmentSchool
 catchmentProgram
 currentGrade
 placingGrade
 inSpecialAdmissionRegion
 isNewlyArrived
 currentSchoolMunicipality
 currentSchoolName
 currentSchoolProgram
 currentPreSchoolMunicipality
 currentPreSchool
 placementAddress
 placementZipcode
 placementCity
 placementAddressMunicipality
 placementLat
 placementLng
 limitedParticipation
 municipalityCaseId
 isVoucherSchoolOnly
 municipality
 firstName
 lastName
 placementIndex
 createdAt
 schoolMunicipality
 schoolName
 schoolProgram
 manuallyApprovedBy
 expires
 priorityGroup
 priorityGroupDescription
 hasSiblingPriority
 hasCompleteChoice
 distance
 relativeDistance
 alternativeSchool
 distanceAlternativeSchool
 lotteryNumberSimple
 distanceCutOff
 priorityScore
 currrentPreSchool
 appealNumber participantType placementStatus approvedParent1 approvedParent2 } 
}`;
        return this.post({ query, variables: { schoolMunicipality: schoolMunicipality,schoolName: schoolName } });
    }

    
    /**
     * Creates a new placements, fails if placements already exists.
     * */
    public bulkInsertPlacements = (placements: IPlacement[]): Promise<void> => {
        const query = `mutation placement_bulkInsertPlacements($placements: [PlacementInput]) {
    placement_bulkInsertPlacements(placements: $placements)
     { undefined } 
}`;
        return this.post({ query, variables: { placements: placements } });
    }

    
    /**
     * Clears the placement db and refills it from placing algo
     * */
    public runPlacingAlgorithm = (grade: number, placementRoundId: number): Promise<void> => {
        const query = `mutation placement_runPlacingAlgorithm($grade: Int, $placementRoundId: Int) {
    placement_runPlacingAlgorithm(grade: $grade, placementRoundId: $placementRoundId)
     { undefined } 
}`;
        return this.post({ query, variables: { grade: grade,placementRoundId: placementRoundId } });
    }

    
    /**
     * Clears the priority ground table for grade and round id, replace it output from lambda
     * */
    public runPriorityGroundAssesor = (grade: number, placementRoundId: number): Promise<void> => {
        const query = `mutation placement_runPriorityGroundAssesor($grade: Int, $placementRoundId: Int) {
    placement_runPriorityGroundAssesor(grade: $grade, placementRoundId: $placementRoundId)
     { undefined } 
}`;
        return this.post({ query, variables: { grade: grade,placementRoundId: placementRoundId } });
    }

    
    /**
     * Updates the placement status
     * */
    public setPlacementStatus = (placement: IPlacement): Promise<void> => {
        const query = `mutation placement_setPlacementStatus($placement: PlacementInput) {
    placement_setPlacementStatus(placement: $placement)
     { undefined } 
}`;
        return this.post({ query, variables: { placement: placement } });
    }

}
