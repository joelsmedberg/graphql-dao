/**
 * Autogenerated interface, DO NOT MODIFY
 */
/* tslint:disable */
import { GraphDao } from "./graph-dao";
import { ICommunicationTrigger } from "./interfaces/communication-trigger.generated"; 
import { IViewTriggerWiring } from "./interfaces/view-trigger-wiring.generated"; 
import { ICommunicationTriggerAction } from "./interfaces/communication-trigger-action.generated"; 

export class TriggerDao extends GraphDao {
    
    /**
     * List all available triggers
     * */
    public listTriggers = (): Promise<ICommunicationTrigger[]> => {
        const query = `query trigger_listTriggers {
    trigger_listTriggers
     { triggerName
 description
 jsonSchema
 entryPoint
 sampleData } 
}`;
        return this.post({ query, variables: {  } });
    }

    
    /**
     * List the trigger actions for municipality
     * */
    public listWiring = (): Promise<IViewTriggerWiring[]> => {
        const query = `query trigger_listWiring {
    trigger_listWiring
     { triggerName
 description
 jsonSchema
 entryPoint
 sampleData
 createdAt
 createdBy
 municipality
 templateName
 corpus
 parentOrganization
 subject
 isBroken templateMedium } 
}`;
        return this.post({ query, variables: {  } });
    }

    
    /**
     * Add a trigger action, must be unique name - action - municipality
     * */
    public addTriggerAction = (action: ICommunicationTriggerAction): Promise<void> => {
        const query = `mutation trigger_addTriggerAction($action: CommunicationTriggerActionInput) {
    trigger_addTriggerAction(action: $action)
     { undefined } 
}`;
        return this.post({ query, variables: { action: action } });
    }

    
    /**
     * Delets a trigger, must be in your own municipality based on municipality, action and template name
     * */
    public deleteTriggerAction = (action: ICommunicationTriggerAction): Promise<void> => {
        const query = `mutation trigger_deleteTriggerAction($action: CommunicationTriggerActionInput) {
    trigger_deleteTriggerAction(action: $action)
     { undefined } 
}`;
        return this.post({ query, variables: { action: action } });
    }

    
    /**
     * Fires the test trigger, use for debug purposes
     * */
    public fireTestTrigger = (placementRoundId: number, studentSsn: string): Promise<void> => {
        const query = `mutation trigger_fireTestTrigger($placementRoundId: Int, $studentSsn: String) {
    trigger_fireTestTrigger(placementRoundId: $placementRoundId, studentSsn: $studentSsn)
     { undefined } 
}`;
        return this.post({ query, variables: { placementRoundId: placementRoundId,studentSsn: studentSsn } });
    }

}
