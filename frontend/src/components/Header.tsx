import { Link } from "react-router-dom";
import { useEffect } from "react";

import {
    Menubar,
    MenubarMenu,
} from "@/components/ui/menubar";
import Account from "./Profile";

import { useAuthContext, AuthContextType } from "../context/AuthContext.tsx";

function Header() {

    const { authUser } = useAuthContext() as AuthContextType;

    useEffect(() => {
        const elements = document.getElementsByClassName('navlinks');
        [...elements].forEach(ele => {
            ele.addEventListener('click', () => {
                [...elements].forEach(ele2 => {
                    ele2.classList.remove('navlinks-active');
                    ele2.classList.add('navlinks-inactive');
                })
                ele.classList.remove('navlinks-inactive');
                ele.classList.add('navlinks-active');
            })
        });
    }, [])

    return (
        <nav className="grid grid-cols-4">
            <div className="h-fit w-fit p-2 col-span-3">
                <Menubar>
                    {
                        (authUser === undefined)
                        ?   <MenubarMenu>
                                <button className="navlinks navlinks-inactive pointer-events-none h-7 w-20 px- py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">Game</button>
                                <Link to="/">
                                    <button className="navlinks navlinks-active h-7 w-20 px-3 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">Account</button>
                                </Link>
                            </MenubarMenu>
                        :   <MenubarMenu>
                                 <Link to="game">
                                    <button className="navlinks navlinks-active h-7 w-20 px- py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">Game</button>
                                </Link>
                                <button className="navlinks navlinks-inactive pointer-events-none h-7 w-20 px-3 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">Account</button>
                            </MenubarMenu>
                    }
                </Menubar>
            </div>
            <div className="flex justify-end items-center p-2">
                <Account />
            </div>
        </nav>
    )
}

export default Header