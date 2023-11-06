import {useState} from "react";
import './App.css';

import {Timer} from "./Timer";


export default function App() {
    const [moduleState, setModuleState] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    // 0 - timer
    // 1 - training CFOP algorithms

    return (
        <>
            {isVisible}
            <button onClick={() => {setModuleState(0)}}>Timer</button>
            <button onClick={() => {setModuleState(1)}}>Algorithms</button>
            {moduleState === 0 ? (
                <div className="Timer">
                    <Timer holdingSpaceTime={500}/>
                </div>
                ) :
                <div className="">
                </div>
            }
        </>

    );
}
