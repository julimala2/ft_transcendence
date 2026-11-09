import { Link } from "react-router-dom";

export function Logo({className}) {
    const cl = `'flex flex-row flex-1 justify-center text-3xl ${className} font-[Slackey] '`

    return (
        <Link className="h-full align-center items-center flex" to={"/"}>
            <p className={cl}>
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