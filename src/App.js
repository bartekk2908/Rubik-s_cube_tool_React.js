import {useEffect, useState} from "react";
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

    const [isVisible, setIsVisible] = useState(true);
    const [algorithmsData, setAlgorithmsData] = useState(null);
    const [learningStateDict, setLearningStateDict] = useState((localStorage.getItem('learningStateDict') === null ? new Map() : new Map(JSON.parse(localStorage.getItem('learningStateDict')))));

    const normalSolvingResults = useLiveQuery(
        () => db.normal_solving_results.toArray()
    );

    const PllResults = useLiveQuery(
        () => db.pll_oll_results.where("algorithmType").equals("PLL").toArray()
    );

    const OllResults = useLiveQuery(
        () => db.pll_oll_results.where("algorithmType").equals("OLL").toArray()
    );

    // loading excel file data to 'algorithmsData' state
    fetch(pathToExcelFile)
        .then((res) => res.arrayBuffer())
        .then((ab) => {
            const wb = XLSX.read(ab, { type: "array" });
            const worksheet = wb.Sheets[wb.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            setAlgorithmsData(jsonData.slice(1));
        });

    function setVisibility(timerState) {
        timerState > 0 ? setIsVisible(false) : setIsVisible(true);
    }

    function giveLearningState(id, value) {
        const temp = learningStateDict.set(id, value);
        localStorage.setItem("learningStateDict", JSON.stringify(Array.from(temp)));
    }

    return (
        <>
            {isVisible ? (
                <>
                    <button className={"custom-button"} disabled={!moduleState} onClick={() => {setModuleState(0)}}>Timer</button>
                    <button className={"custom-button"} disabled={moduleState} onClick={() => {setModuleState(1)}}>Algorithms</button>
                </>
            ) : ""}
            {moduleState === 0 ? (
                <div className="Timer">
                    <Timer
                        holdingSpaceTime={500}
                        giveTimerStateFunc={setVisibility}
                        scrambleLength={20}
                        results={[normalSolvingResults, PllResults, OllResults]}
                        algorithmsData={algorithmsData}
                        learningStateDict={learningStateDict}
                    />
                </div>
                ) :
                <div className="Timer">
                    <AlgorithmsList
                        algorithmsData={algorithmsData}
                        giveLearningStateFunc={giveLearningState}
                        learningStateDict={learningStateDict}
                    />
                </div>
            }
        </>

    );
}
