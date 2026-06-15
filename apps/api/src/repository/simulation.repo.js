import {pool} from '../config/db.js'


export async function fetchSimulation(){
    const [rows] = await pool.query('select * from simulations');
    return rows     
}

export async function fetchSimulationById(id){
    const [rows] = await pool.query('select * from simulations where id = ? ',[id])

    return rows
}
