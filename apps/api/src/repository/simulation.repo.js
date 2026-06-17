import {pool} from '../config/db.js'
import { Simulation } from '../models/Simulation.js';


export async function fetchSimulationAndTransform(){
    const [rows] = await pool.query('select * from simulations');
    const SimRows = await transformToSimObj(rows)
    return SimRows

}

export async function fetchSimulationByIdAndTransform(id){
    const [rows] = await pool.query('select * from simulations where id = ? ',[id])
    const SimRows = await transformToSimObj(rows)

    return SimRows
}


async function transformToSimObj(rows){
    let SimArr = []

    if(rows.length === 0){
        const newSimObj = new new Simulation(row.id,row.subject_id,row.topic_id,row.description,row.created_at,row.updated_at)
        SimArr.push(newSimObj)
        return SimArr
    }

   for(let row of rows){
       const newSimObj = new Simulation(row.id,row.subject_id,row.topic_id,row.description,row.created_at,row.updated_at)
       SimArr.push(newSimObj)
   }

   return SimArr
}



