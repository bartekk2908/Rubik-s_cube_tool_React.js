import {useEffect, useState} from "react";
import ProgressBar from 'react-bootstrap/ProgressBar';

import {Algorithm} from "./Algorithm";
import {colorOfNumber, giveListOfChosenAlgorithms, giveOppositeColor} from "./extra_functions";

export function AlgorithmsList({ algorithmsData, giveTrainingStateFunc, trainingStateDict }) {
    const [colorOnTop, setColorOnTop] = useState(4);
    const [colorOnFront, setColorOnFront] = useState(5);
    const [tab, setTab] = useState(0);
    // 0 - PLLs
    // 1 - OLLs
    const tabNames = ["PLL", "OLL"];

    const colorNumbersForTop = [1, 2, 3, 4, 5, 6];
    const colorNumbersForFront = colorNumbersForTop.slice();
    colorNumbersForFront.splice(colorNumbersForFront.indexOf(colorOnTop), 1);
    colorNumbersForFront.splice(colorNumbersForFront.indexOf(giveOppositeColor(colorOnTop)), 1);

    // Set first possible color for Front when color for Top is changed
    useEffect(() => {
        setColorOnFront(colorNumbersForFront[0]);
    }, [colorOnTop])

    // Map algorithms data to display cases with sequence
    const algorithms = algorithmsData?.map((algorithmData, i) => {
        return (
            algorithmData[23] === tabNames[tab] ? (
                <div key={i}>
                    <Algorithm
                        algorithmData={algorithmData}
                        colorOnTop={colorOnTop}
                        colorOnFront={colorOnFront}
                        giveTrainingStateFunc={giveTrainingStateFunc}
                        trainingStateValue={trainingStateDict.get(i)}
                    />
                </div>
            ) : (
                ""
            )
        );
    });

    const numberOfGreenPLLs = giveListOfChosenAlgorithms(2, "PLL", trainingStateDict, algorithmsData).length;
    const numberOfYellowPLLs = giveListOfChosenAlgorithms(1, "PLL", trainingStateDict, algorithmsData).length;
    const numberOfPLLs = numberOfGreenPLLs + numberOfYellowPLLs + giveListOfChosenAlgorithms(0, "PLL", trainingStateDict, algorithmsData).length;

    const numberOfGreenOLLs = giveListOfChosenAlgorithms(2, "OLL", trainingStateDict, algorithmsData).length;
    const numberOfYellowOLLs = giveListOfChosenAlgorithms(1, "OLL", trainingStateDict, algorithmsData).length;
    const numberOfOLLs = numberOfGreenOLLs + numberOfYellowOLLs + giveListOfChosenAlgorithms(0, "OLL", trainingStateDict, algorithmsData).length;

    return (
        <div>
            <div className={"algorithms-list-menu"}>
                <button
                    className={"custom-button"}
                    disabled={!tab}
                    onClick={() => {setTab(0)}}
                >PLLs</button>
                <button
                    className={"custom-button"}
                    disabled={tab}
                    onClick={() => {setTab(1)}}
                >OLLs</button>
                <div className={"colors-menu"}>
                    {colorNumbersForTop.slice().map((i) => {
                        return (
                            <button
                                className={"color-button"}
                                onClick={() => {setColorOnTop(i)}}
                                style={{height: "20px", width: "20px", backgroundColor: colorOfNumber[i], color: ([1, 4].includes(i) ? "black" : "white"), fontSize: "10px"}}
                                key={i}
                            >{colorOnTop === i ? "X" : "_"}</button>
                        );
                    })}
                </div>
                <div className={"colors-menu"}>
                    {colorNumbersForFront.slice().map((i) => {
                        return (
                            <button
                                className={"color-button"}
                                onClick={() => {setColorOnFront(i)}}
                                style={{height: "20px", width: "20px", backgroundColor: colorOfNumber[i], color: ([1, 4].includes(i) ? "black" : "white"), fontSize: "10px"}}
                                key={i}
                            >{colorOnFront === i ? "X" : "_"}</button>
                        );
                    })}
                </div>
            </div>
            {tab ? (
                <>
                    <b>OLLs progress: {numberOfGreenOLLs}/{numberOfOLLs}</b>
                    <ProgressBar>
                        <ProgressBar
                            min={0} max={numberOfOLLs}
                            now={numberOfGreenOLLs}
                            label={numberOfGreenOLLs}
                            variant={"success"}
                            key={1}
                        />
                        <ProgressBar
                            min={0}
                            max={numberOfOLLs}
                            now={numberOfYellowOLLs}
                            label={numberOfYellowOLLs}
                            variant={"warning"}
                            key={2}
                        />
                    </ProgressBar>
                </>
            ) : (
                <>
                    <b>PLLs progress: {numberOfGreenPLLs}/{numberOfPLLs}</b>
                    <ProgressBar>
                        <ProgressBar
                            min={0}
                            max={numberOfPLLs}
                            now={numberOfGreenPLLs}
                            label={numberOfGreenPLLs}
                            variant={"success"}
                            key={1}
                        />
                        <ProgressBar
                            min={0}
                            max={numberOfPLLs}
                            now={numberOfYellowPLLs}
                            label={numberOfYellowPLLs}
                            variant={"warning"}
                            key={2}
                        />
                    </ProgressBar>
                </>
            )}
            <div className={"algorithms"}>
                {algorithms ?? ""}
            </div>
        </div>
    );
}
