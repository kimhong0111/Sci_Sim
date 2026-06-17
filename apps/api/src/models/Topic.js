export class Topic {
   id 
   subject_id
   name 
   created_at 

   constructor(id,subject_id,name,created_at){
      this.id = parseInt(id)
      this.subject_id = parseInt(subject_id)
      this.name = name
      this.created_at = created_at
   }
}