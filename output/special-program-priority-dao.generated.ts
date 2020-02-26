/**
 * Autogenerated interface, DO NOT MODIFY
 */
/* tslint:disable */
import { GraphDao } from "./graph-dao";
import { ISpecialProgramPriority } from "./interfaces/special-program-priority.generated"; 

export class SpecialProgramPriorityDao extends GraphDao {
    
    /**
     * List all special program priorities
     * */
    public listPriorities = (): Promise<ISpecialProgramPriority[]> => {
        const query = `query specialProgramPriority_listPriorities {
    specialProgramPriority_listPriorities
     { undefined } 
}`;
        return this.post({ query, variables: {  } });
    }

    
    /**
     * Uploads a batch of special program priorities to the db
     * */
    public uploadPriorities = (list: ISpecialProgramPriority[]): Promise<void> => {
        const query = `mutation specialProgramPriority_uploadPriorities($list: [SpecialProgramPriorityInput]) {
    specialProgramPriority_uploadPriorities(list: $list)
     { undefined } 
}`;
        return this.post({ query, variables: { list: list } });
    }

}
