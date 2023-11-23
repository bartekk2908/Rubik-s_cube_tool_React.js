import {useState, useEffect} from "react";

import {AlgorithmFace} from "./AlgorithmFace";

export function Algorithm({ algorithmData, colorOnTop, colorOnFront, giveTrainingStateFunc, trainingStateValue=0 }) {
    const [trainingState, setTrainingState] = useState(trainingStateValue);
    // 0 - new / not learned yet
    // 1 - training
    // 2 - learned

    const algorithmName = algorithmData[0];
    const algorithmSequence = algorithmData[1];
    const algorithmType = algorithmData[23];
    const algorithmId = algorithmData[24];
    const piecesScheme = algorithmData.slice(2, 23);

    // After click in algorithm area changes its state of training
    function switchTrainingState() {
        switch (trainingState) {
            case 0:
                setTrainingState(1);
                break;
            case 1:
                setTrainingState(2);
                break;
            case 2:
                setTrainingState(0);
                break;
            default:
        }
    }

    useEffect(() => {
        giveTrainingStateFunc(algorithmId, trainingState);
    }, [trainingState]);

    return (
        <button
            style={{display: "flex", backgroundColor: (trainingState === 0 ? "" : (trainingState === 1 ? "#ffff4d" : "lightgreen"))}}
            onClick={switchTrainingState}
            className={"algorithm-area"}
        >
            <AlgorithmFace
                piecesScheme={piecesScheme}
                colorOnTop={colorOnTop}
                colorOnFront={colorOnFront}
            />
            <div className={"algorithm-text"}>
                <div>
                    {algorithmSequence}
                </div>
                <b>
                    {algorithmType + " - " + algorithmName}
                </b>
            </div>
        </button>
    );
}
