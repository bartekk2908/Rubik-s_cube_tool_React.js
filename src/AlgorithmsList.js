import {useState} from "react";
import ProgressBar from 'react-bootstrap/ProgressBar';

import {Algorithm} from "./Algorithm";
import {giveListOfChosenAlgorithms} from "./extra_functions";

export function AlgorithmsList({ algorithmsData, giveLearningStateFunc, learningStateDict }) {
    const [colorOnTop, setColorOnTop] = useState(4);
    const [colorOnFront, setColorOnFront] = useState(5);
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
            <div style={{marginBottom: "20px", display: "flex"}}>
                <button className={"custom-button"} disabled={!algorithmsListState} onClick={() => {setAlgorithmsListState(0)}}>PLLs</button>
                <button className={"custom-button"} disabled={algorithmsListState} onClick={() => {setAlgorithmsListState(1)}}>OLLs</button>
                <div style={{padding: "20px", backgroundColor: "#999"}}>
                    <button onClick={() => {setColorOnTop(4)}} style={{height: "20px", width: "20px", backgroundColor: "yellow", fontSize: "10px"}}>X</button>
                </div>
            </div>
            {algorithmsListState ? (
                <>
                    <b>OLLs progress: {numberOfGreenOLLs}/{numberOfOLLs}</b>
                    <ProgressBar>
                        <ProgressBar min={0} max={numberOfOLLs} now={numberOfGreenOLLs} label={numberOfGreenOLLs} variant={"success"} key={1} />
                        <ProgressBar min={0} max={numberOfOLLs} now={numberOfYellowOLLs} label={numberOfYellowOLLs} variant={"warning"} key={2} />
                    </ProgressBar>
                </>
            ) : (
                <>
                    <b>PLLs progress: {numberOfGreenPLLs}/{numberOfPLLs}</b>
                    <ProgressBar>
                        <ProgressBar min={0} max={numberOfPLLs} now={numberOfGreenPLLs} label={numberOfGreenPLLs} variant={"success"} key={1} />
                        <ProgressBar min={0} max={numberOfPLLs} now={numberOfYellowPLLs} label={numberOfYellowPLLs} variant={"warning"} key={2} />
                    </ProgressBar>
                </>
            )}
            <div className={"algorithms-list"}>
                {algorithms}
            </div>
        </div>
    );
}
