import { Link } from "react-router-dom";

export function Logo({className}) {

    let logoclass = `font-[Slackey] text-8xl border-6 rounded-3xl p-6 ${className}`;

    return (
        <Link className="" to={"/"}>
            <p className={`${logoclass}`}>
                <label className="text-amber-400">Q</label>
                <label className="text-red-400">u</label>
                <label className="text-blue-400">i</label>
                <label className="text-green-400">z</label>
                <label className="text-orange-400">G</label>
                <label className="text-emerald-400">a</label>
                <label className="text-slate-400">m</label>
                <label className="text-amber-400">e</label>
                <label className="text-red-400">!</label>
            </p>
        </Link>
    )
}