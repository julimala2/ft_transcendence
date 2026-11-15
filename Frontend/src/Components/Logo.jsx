import { Link } from "react-router-dom";
import { StyledDiv } from "./Containers";

export function Logo({className}) {
    const cl = `'flex flex-row flex-1 justify-center text-4xl ${className} font-[Slackey] '`

    return (
        <Link className="h-full w-full align-center items-center flex" to={"/"}>
            <StyledDiv className="aspect-square w-full h-full flex items-center justify-center">
                <p className={cl}>
                    <label className="text-amber-400">Q</label>
                    <label className="text-red-400">!</label>
                </p>
            </StyledDiv>
        </Link>
    )
}