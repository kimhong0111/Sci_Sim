
export class Simulation {
    id 
    subject_id
    topic_id
    title 
    description
    created_at
    updated_at

    constructor(id,subject_id,topic_id,description,created_at,updated_at){
        this.id = parseInt(id)
        this.subject_id = parseInt(subject_id)
        this.topic_id = parseInt(topic_id)
        this.description = description
        this.created_at = created_at
        this.updated_at = updated_at
    }
}