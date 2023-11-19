import {useState, useEffect} from "react";

import {AlgorithmFace} from "./AlgorithmFace";

export function Algorithm({ algorithmData, colorOnTop, colorOnFront, giveLearningStateFunc, learningStateValue=0 }) {
    const [learningState, setLearningState] = useState(learningStateValue);
    // 0 - not learning
    // 1 - learning
    // 2 - learned

    const algorithmName = algorithmData[0];
    const algorithmString = algorithmData[1];
    const algorithmId = algorithmData[24];
    const piecesScheme = algorithmData.slice(2);

    function switchLearningState() {
        if (learningState === 0) {
            setLearningState(1);
        } else if (learningState === 1) {
            setLearningState(2);
        } else {
            setLearningState(0);
        }
    }

    useEffect(() => {
        giveLearningStateFunc(algorithmId, learningState);
    }, [learningState]);

    return (
        <button style={{display: "flex", backgroundColor: (learningState === 0 ? "" : (learningState === 1 ? "yellow" : "lightgreen"))}}
                onClick={switchLearningState}
                className={"algorithm-container"}>
            <AlgorithmFace piecesScheme={piecesScheme} colorOnTop={colorOnTop} colorOnFront={colorOnFront}/>
            <div style={{display: "block", width: "300px"}}>
                <div>
                    {algorithmString}
                </div>
                <div>
                    {algorithmName}
                </div>
            </div>
        </button>
    );
}
