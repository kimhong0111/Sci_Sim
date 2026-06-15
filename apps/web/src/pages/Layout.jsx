import { Nav } from "./Nav"
import { Outlet } from "react-router"



export function Layout(){
    return (
        <div>
           <Nav />
           <Outlet />
        </div>
    )
}