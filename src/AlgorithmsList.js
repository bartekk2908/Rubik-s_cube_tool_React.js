import {useState} from "react";
import ProgressBar from 'react-bootstrap/ProgressBar';

import {Algorithm} from "./Algorithm";
import {giveListOfChosenAlgorithms} from "./extra_functions";

export function AlgorithmsList({ colorOnTop = 1, colorOnFront = 5, algorithmsData, giveLearningStateFunc, learningStateDict }) {
    const [algorithmsListState, setAlgorithmsListState] = useState(0);
    // 0 - PLLs
    // 1 - OLLs
    const algorithmStates = ["PLL", "OLL"];

    let algorithms = [];
    if (algorithmsData) {
        algorithms = algorithmsData.map((algorithmData, i) => {
            return (
                algorithmData[23] === algorithmStates[algorithmsListState] ? (
                    <div key={i}>
                        <Algorithm
                            algorithmData={algorithmData}
                            colorOnTop={colorOnTop}
                            colorOnFront={colorOnFront}
                            giveLearningStateFunc={giveLearningStateFunc}
                            learningStateValue={learningStateDict.get(i)}
                        />
                    </div>
                ) : (
                    ""
                )
            );
        });
    }

    const numberOfGreenPLLs = giveListOfChosenAlgorithms(2, "PLL", learningStateDict, algorithmsData).length;
    const numberOfYellowPLLs = giveListOfChosenAlgorithms(1, "PLL", learningStateDict, algorithmsData).length;
    const numberOfPLLs = numberOfGreenPLLs + numberOfYellowPLLs + giveListOfChosenAlgorithms(0, "PLL", learningStateDict, algorithmsData).length;

    const numberOfGreenOLLs = giveListOfChosenAlgorithms(2, "OLL", learningStateDict, algorithmsData).length;
    const numberOfYellowOLLs = giveListOfChosenAlgorithms(1, "OLL", learningStateDict, algorithmsData).length;
    const numberOfOLLs = numberOfGreenOLLs + numberOfYellowOLLs + giveListOfChosenAlgorithms(0, "OLL", learningStateDict, algorithmsData).length;

    return (
        <div>
            <div style={{marginBottom: "20px"}}>
                <button className={"custom-button"} onClick={() => {setAlgorithmsListState(0)}}>PLLs</button>
                <button className={"custom-button"} onClick={() => {setAlgorithmsListState(1)}}>OLLs</button>
            </div>
            {algorithmsListState ? (
                <>
                    <div>OLLs progress: {numberOfGreenOLLs}/{numberOfOLLs}</div>
                    <ProgressBar>
                        <ProgressBar min={0} max={numberOfOLLs} now={numberOfGreenOLLs} label={numberOfGreenOLLs} variant={"success"} key={1} />
                        <ProgressBar min={0} max={numberOfOLLs} now={numberOfYellowOLLs} label={numberOfYellowOLLs} variant={"warning"} key={2} />
                    </ProgressBar>
                    <div className={"algorithms-list"}>
                        {algorithms}
                    </div>
                </>
            ) : (
                <>
                    <div>PLLs progress: {numberOfGreenPLLs}/{numberOfPLLs}</div>
                    <ProgressBar>
                        <ProgressBar min={0} max={numberOfPLLs} now={numberOfGreenPLLs} label={numberOfGreenPLLs} variant={"success"} key={1} />
                        <ProgressBar min={0} max={numberOfPLLs} now={numberOfYellowPLLs} label={numberOfYellowPLLs} variant={"warning"} key={2} />
                    </ProgressBar>
                    <div className={"algorithms-list"}>
                        {algorithms}
                    </div>
                </>
            )}
        </div>
    );
}
