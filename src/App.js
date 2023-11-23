import {useState} from "react";
import './App.css';
import * as XLSX from "xlsx";

import {Timer} from "./Timer";
import {AlgorithmsList} from "./AlgorithmsList";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "./db";

const pathToExcelFile = "./excel/Algorithms.xlsx";

export default function App() {
    const [moduleState, setModuleState] = useState(0);
    // 0 - timer
    // 1 - training CFOP algorithms

    const [visibility, setVisibility] = useState(true);
    const [algorithmsData, setAlgorithmsData] = useState(null);
    const [trainingStatesDict, setTrainingStatesDict] = useState(
        (localStorage.getItem('trainingStatesDict') === null ? new Map() :
            new Map(JSON.parse(localStorage.getItem('trainingStatesDict'))))
    );

    const normalSolvingResults = useLiveQuery(
        () => db.solving_results.toArray()
    );

    const PllResults = useLiveQuery(
        () => db.pll_oll_training_results.where("algorithmType").equals("PLL").toArray()
    );

    const OllResults = useLiveQuery(
        () => db.pll_oll_training_results.where("algorithmType").equals("OLL").toArray()
    );

    // Loading excel file data to 'algorithmsData' state
    fetch(pathToExcelFile)
        .then((res) => res.arrayBuffer())
        .then((ab) => {
            const wb = XLSX.read(ab, { type: "array" });
            const worksheet = wb.Sheets[wb.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            setAlgorithmsData(jsonData.slice(1));
        });

    function determineVisibility(timerState) {
        timerState > 0 ? setVisibility(false) : setVisibility(true);
    }

    function giveTrainingState(id, value) {
        localStorage.setItem("learningStateDict", JSON.stringify(Array.from(trainingStatesDict.set(id, value))));
    }

    return (
        <>
            {visibility ? (
                <>
                    <button
                        className={"custom-button"}
                        disabled={!moduleState}
                        onClick={() => {setModuleState(0)}}
                    >Timer</button>
                    <button
                        className={"custom-button"}
                        disabled={moduleState}
                        onClick={() => {setModuleState(1)}}
                    >Algorithms</button>
                </>
            ) : ""}
            {moduleState === 0 ? (
                <div className="timer">
                    <Timer
                        holdingSpaceTime={500}
                        determineVisibilityFunc={determineVisibility}
                        scrambleLength={20}
                        results={[normalSolvingResults, PllResults, OllResults]}
                        algorithmsData={algorithmsData}
                        trainingStateDict={trainingStatesDict}
                    />
                </div>
                ) :
                <div className="algorithms-list">
                    <AlgorithmsList
                        algorithmsData={algorithmsData}
                        giveTrainingStateFunc={giveTrainingState}
                        trainingStateDict={trainingStatesDict}
                    />
                </div>
            }
        </>

    );
}
