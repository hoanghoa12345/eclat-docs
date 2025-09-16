import type { User } from "better-auth";
import { navigate } from "astro:transitions/client";
import { signOut } from "../../lib/auth-client";

export default function UserButton({ user }: { user: User }) {

    const handleSignOut = async () => {
        await signOut()
        navigate("/login")
    }

    return (
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className=" btn btn-circle m-1">
                <div className="avatar">
                    <div className="w-8 rounded-full">
                        <img src={user.image!} alt={user.name} />
                    </div>
                </div>
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                <li> <a role="button" onClick={handleSignOut}>Logout</a></li>
            </ul>
        </div>
    );
}