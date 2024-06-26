import {useEffect, useState, useRef} from "react";
import ProgressBar from 'react-bootstrap/ProgressBar';

import {Algorithm} from "./Algorithm";
import {colorOfNumber, giveListOfChosenAlgorithms, giveOppositeColor} from "./functions";

export function AlgorithmsTab({ algorithmsData, giveTrainingStateFunc, trainingStateDict, settings, results, startTab, setStartTab }) {
    const [colorOnTop, setColorOnTop] = useState(+localStorage.getItem("colorOnTop") || 1);
    const [colorOnFront, setColorOnFront] = useState(+localStorage.getItem("colorOnFront") || 2);
    const [tab, setTab] = useState(startTab);
    // 0 - PLLs
    // 1 - OLLs
    const colorsMenuVisible = settings.get("colorsMenu") ?? true;

    const colorNumbersForTop = [1, 2, 3, 4, 5, 6];
    const colorNumbersForFront = colorNumbersForTop.slice();
    colorNumbersForFront.splice(colorNumbersForFront.indexOf(colorOnTop), 1);
    colorNumbersForFront.splice(colorNumbersForFront.indexOf(giveOppositeColor(colorOnTop)), 1);

    // Set first possible colorOnFront when colorOnTop is changed + save colorOnTop to localStorage
    const firstUpdate = useRef(2);
    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current--;
            return ;
        }
        setColorOnFront(colorNumbersForFront[0]);
        localStorage.setItem("colorOnTop", colorOnTop);
    }, [colorOnTop])

    // Save colorOnFront to localStorage
    useEffect(() => {
        localStorage.setItem("colorOnFront", colorOnFront);
    }, [colorOnFront]);

    // Map algorithms data to display cases with sequence
    const algorithms = algorithmsData?.map((algorithmData, i) => {
        return (
            algorithmData[23] === ["PLL", "OLL"][tab] ? (
                <Algorithm
                    algorithmData={algorithmData}
                    colorOnTop={colorOnTop}
                    colorOnFront={colorOnFront}
                    giveTrainingStateFunc={giveTrainingStateFunc}
                    trainingStateValue={trainingStateDict.get(i)}
                    key={i}
                    results={results[tab].filter((result) => result.algorithmName === algorithmData[0])}
                />
            ) : (
                ""
            )
        );
    });

    const numberOfGreenPLLs = giveListOfChosenAlgorithms([2], "PLL", trainingStateDict, algorithmsData).length;
    const numberOfYellowPLLs = giveListOfChosenAlgorithms([1], "PLL", trainingStateDict, algorithmsData).length;
    const numberOfPLLs = numberOfGreenPLLs + numberOfYellowPLLs + giveListOfChosenAlgorithms([0], "PLL", trainingStateDict, algorithmsData).length;

    const numberOfGreenOLLs = giveListOfChosenAlgorithms([2], "OLL", trainingStateDict, algorithmsData).length;
    const numberOfYellowOLLs = giveListOfChosenAlgorithms([1], "OLL", trainingStateDict, algorithmsData).length;
    const numberOfOLLs = numberOfGreenOLLs + numberOfYellowOLLs + giveListOfChosenAlgorithms([0], "OLL", trainingStateDict, algorithmsData).length;

    return (
        <div className="algorithms-tab">
            <div className={"tabs-menu"}>
                <button
                    className={"custom-button orange-button big-button"}
                    disabled={!tab}
                    onClick={() => {
                        setTab(0);
                        setStartTab(0);
                    }}
                >PLL</button>
                <button
                    className={"custom-button orange-button big-button"}
                    disabled={tab}
                    onClick={() => {
                        setTab(1);
                        setStartTab(1);
                    }}
                >OLL</button>
            </div>
            {colorsMenuVisible ? (
                <div className={"colors-menu"}>
                    <div className={"colors-menu-part"}>
                        <div className={"description-inner-text"}>Top color:</div>
                        <div className={"color-buttons-row"}>
                            {colorNumbersForTop.slice().map((i) => {
                                return (
                                    <button
                                        className={"color-button"}
                                        onClick={() => {setColorOnTop(i)}}
                                        style={{backgroundColor: colorOfNumber[i], color: ([1, 4].includes(i) ? "black" : "white")}}
                                        key={i}
                                    >{colorOnTop === i ? "X" : "_"}</button>
                                );
                            })}
                        </div>
                    </div>
                    <div className={"colors-menu-part"}>
                        <div className={"description-inner-text"}>Front color:</div>
                        <div className={"color-buttons-row"}>
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
                </div>
            ) : ""}
            {tab ? (
                <>
                    <br/><br/>
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
                    <br/><br/>
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
            <br/>
            <div className={"algorithms-table"}>
                <div className={"algorithms-row algorithms-table-header"}>
                    <div className={"algorithms-cell algorithm-name-width"}>
                        Name
                    </div>
                    <div className={"algorithms-cell algorithm-face-width"}>
                        Case
                    </div>
                    <div className={"algorithms-cell algorithm-sequence-width"}>
                        Sequence
                    </div>
                    <div className={"algorithms-cell algorithm-stat-width"}>
                        Best time
                    </div>
                    <div className={"algorithms-cell algorithm-stat-width"}>
                        Average of 12
                    </div>
                    <div className={"algorithms-cell algorithm-stat-width"}>
                        Overall Average
                    </div>
                </div>
                {algorithms ?? ""}
            </div>
            <br/><br/>
        </div>
    );
}
