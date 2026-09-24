//Main dispatcher for profile widgette

import { useAuth } from "../Context/AuthContext";
import { AuthWidget } from "../Auth/AuthWidget";
import { MyProfile } from "./MyProfile";
import { PublicProfile } from "./PublicProfile";

export function Profile({userId = null}){
    const {user, loading} = useAuth();

    if(loading) return <p>Loading...</p>;

    const isMe =! userId || (user && String(userId) === String(user.id));

    if(isMe){
        if(!user) return <AuthWidget/>;
        return <MyProfile/>;
    }

    return <PublicProfile userId={userId}/>;
}