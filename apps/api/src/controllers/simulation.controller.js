import { fetchSimulation, fetchSimulationById} from "../repository/simulation.repo.js";

function createResponseMessage(success , message){
    return {
        success : success,
        message : message
    }
}

export async function getAllSimulation(req, res) {
  try {
    const data = await fetchSimulation();

    if (!fetchFailed(data)) {
      return res.status(404).json(createResponseMessage(false,"No Simulation Found"));
    }

    return res.status(200).json(data)

  } catch (err) {
    console.error("[getAllSimulation]", err);

    return res.status(500).json(createResponseMessage(false,"Internal Server Error"));
  }
}

export async function getSimulationById(req,res){
     
    const {id} = req.params;
       
     try{

        const data = await fetchSimulationById(id);
        if(!fetchFailed(data)){
           return res.status(404).json(createResponseMessage(false,"No Simulation Found"));
        }
      
        return res.status(200).json(data);



     }
     catch(err){
        console.error("[getSimulationById]", err);
        return res.status(500).json(createResponseMessage(false,"Internal Server Error"));
     }
}


function fetchFailed(data){
    if(!data ||  data.length === 0){
         return false;
    }

    return true;
}