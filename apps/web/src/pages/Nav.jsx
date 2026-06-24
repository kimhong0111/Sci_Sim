import { NavLink } from "react-router-dom"

export function Nav(){
  return(
    <div className="flex flex-row gap-4">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/simulations">Simulation</NavLink>
    </div>
  )
}