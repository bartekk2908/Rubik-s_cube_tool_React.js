import {useState, useEffect} from "react";

import {AlgorithmFace} from "./AlgorithmFace";
import {formatTime, averageOfLastX, giveBest} from "./functions";

export function Algorithm({ algorithmData, colorOnTop, colorOnFront, giveTrainingStateFunc, trainingStateValue=0, key, results }) {
    const [trainingState, setTrainingState] = useState(trainingStateValue);
    // 0 - new / not learned yet
    // 1 - training
    // 2 - learned

    const algorithmName = algorithmData[0];
    const algorithmSequence = algorithmData[1];
    const algorithmType = algorithmData[23];
    const algorithmId = algorithmData[24];
    const piecesScheme = algorithmData.slice(2, 23);

    // Clicking in algorithm area changes its state of training
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

    const times = results.map((result) => {
        return (result.time);
    });

    return (
        <div
            className={"algorithms-row " + (trainingState ? (trainingState === 1 ? ("learning") : ("finished")) : ("not-being-learned"))}
            key={key}
        >
            <div className={"algorithms-cell algorithm-name algorithm-name-width"}>
                <div>
                    {algorithmName}
                </div>
            </div>
            <button
                className={"algorithms-cell algorithm-face-button"}
                onClick={switchTrainingState}
            >
                <AlgorithmFace
                    piecesScheme={piecesScheme}
                    colorOnTop={colorOnTop}
                    colorOnFront={colorOnFront}
                />
            </button>
            <div className={"algorithms-cell algorithm-sequence algorithm-sequence-width"}>
                <div>
                    {algorithmSequence}
                </div>
            </div>
            <div className={"algorithms-cell algorithm-stat algorithm-stat-width"}>
                <div>
                    {times.length > 0 ? formatTime(giveBest(times)) : "-"}
                </div>
            </div>
            <div className={"algorithms-cell algorithm-stat algorithm-stat-width"}>
                <div>
                    {times.length >= 12 ? formatTime(averageOfLastX(12, times)) : "-"}
                </div>
            </div>
            <div className={"algorithms-cell algorithm-stat algorithm-stat-width"}>
                <div>
                    {times.length !== 0 ? formatTime(averageOfLastX(times.length, times, true)) : "-"}
                </div>
            </div>
        </div>
    );
}
