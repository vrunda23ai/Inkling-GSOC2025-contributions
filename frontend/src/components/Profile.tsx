// import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

import { useAuthContext, AuthContextType } from "../context/AuthContext";
import { useAuth } from "../hooks/useAuth";

function Account() {

    const { authUser } = useAuthContext() as AuthContextType;
    const { submitLogout } = useAuth();
    let profilePic:string;
    let username:string;
    let fullName:string;

    if (authUser) {
        profilePic = authUser.profilePic;
        username = authUser.username;
        fullName = authUser.fullName;
    }
    else{
        profilePic = "https://github.com/shadcn.png";
        username = "guest";
        fullName = "Guest";
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                    <AvatarImage src={profilePic} alt="@shadcn" />
                    <AvatarFallback>JD</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mr-7">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Profile</DropdownMenuLabel>
                <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                    <div>
                        <p>{fullName}</p>
                        <p>{username}</p>
                    </div>
                </div>
                <DropdownMenuSeparator />
                {(authUser) 
                ? <DropdownMenuItem onClick={submitLogout}>Log out</DropdownMenuItem> 
                : <DropdownMenuItem disabled>Log out</DropdownMenuItem>}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default Account;