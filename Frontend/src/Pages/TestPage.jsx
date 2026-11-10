import { MainContainer, PageContainer } from "../Components/Containers";
import { motion } from "motion/react";
import { useState } from "react";
import  ToggleButton  from "../Components/ToggleButton";
import { BlingButton } from "../Components/Buttons";

export default function TestPage () {
    const [click,setClick] = useState(false);
    const [selected,setSelected] = useState(false);
    
    async function handleClick () {
       setClick(!click);
    }

    return (
        <MainContainer>
            <PageContainer>
                {/* <p> Bonjour c'est la test page !</p> */}
                    {/* <button 
                        onClick={() => handleClick()} 
                    >
                        {click ? "hello":"no"}
                    </button>
                    <motion.ul 
                        className={`text-black text-center bg-amber-400 rounded-2xl ${click ? 'w-25 h-25' : 'w-15 h-15'}`}
                        whileHover={click ? {scale : 1.1} : undefined}
                        onClick={()=>handleClick()}
                        layout
                    >Push button</motion.ul>
                    <ToggleButton /> */}
                    <BlingButton 
                        onClick={() => setSelected(!selected)} 
                        selected={selected}>
                            <p>Test</p>
                        </BlingButton>
                    <button>Bojour ?</button>
            </PageContainer>
        </MainContainer>
    )
}