import { useState,useEffect } from "react";
import { apiFetch } from "../Api/api";
import styles from '../Styling/profile.module.css';


// TODO est ce que c'est safe de demander un profile seulement via l'user id

export function PublicProfile({userId}){
    const [profile,setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    useEffect(()=> {
        let cancelled = false;
        setLoading(true);
        setError(null);
    })
}