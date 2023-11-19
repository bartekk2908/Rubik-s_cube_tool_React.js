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

    const [isVisible, setIsVisible] = useState(true);
    const [algorithmsData, setAlgorithmsData] = useState(null);
    const [learningStateDict, setLearningStateDict] = useState(new Map());

    const records = useLiveQuery(
        () => db.times.toArray()
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

    function initLearningStateDict() {
        let dict = new Map();
        for (let i=0; i<100; i++) {
            dict.set(i, 0);
        }
        return dict;
    }

    function setVisibility(timerState) {
        timerState ? setIsVisible(false) : setIsVisible(true);
    }

    function giveLearningState(id, value) {
        learningStateDict.set(id, value);
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
                    <Timer
                        holdingSpaceTime={500}
                        giveTimerStateFunc={setVisibility}
                        scrambleLength={20}
                        records={records}
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
