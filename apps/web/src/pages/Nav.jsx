import { NavLink } from "react-router-dom"



export function Nav(){
     return(
        <div>
            <NavLink to="/">Home</NavLink>

            <NavLink to="/simulations">Simulation</NavLink>
        </div>
     )
}