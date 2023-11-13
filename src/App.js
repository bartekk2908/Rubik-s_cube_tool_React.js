import {useState} from "react";
import './App.css';

import {Timer} from "./Timer";
import {AlgorithmList} from "./AlgorithmList";


export default function App() {
    const [moduleState, setModuleState] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    // 0 - timer
    // 1 - training CFOP algorithms

    function setVisibility(timerState) {
        timerState ? setIsVisible(false) : setIsVisible(true);
    }

    return (
        <>
            {isVisible ? (
                <>
                    <button onClick={() => {setModuleState(0)}}>Timer</button>
                    <button onClick={() => {setModuleState(1)}}>Algorithms</button>
                </>
            ) : ""}
            {moduleState === 0 ? (
                <div className="Timer">
                    <Timer holdingSpaceTime={500} giveTimerStateFunc={setVisibility}/>
                </div>
                ) :
                <div className="Timer">
                    <AlgorithmList/>
                </div>
            }
        </>

    );
}
