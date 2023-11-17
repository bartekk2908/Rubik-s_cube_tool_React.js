import {useState} from "react";
import * as XLSX from "xlsx";

import {AlgorithmsList} from "./AlgorithmsList";

const pathToExcelFile = "./excel/Algorithms.xlsx";

export function AlgorithmTrainer() {
    const [trainerState, setTrainerState] = useState(0);
    // 0 - algorithms list
    // 1 - trainer timer
    const [algorithmsData, setAlgorithmsData] = useState(null);

    // loading excel file data to 'algorithmsData' state
    fetch(pathToExcelFile)
        .then((res) => res.arrayBuffer())
        .then((ab) => {
            const wb = XLSX.read(ab, { type: "array" });
            const worksheet = wb.Sheets[wb.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            setAlgorithmsData(jsonData.slice(1));
        });

    return (
        <>
            <div>
                <button onClick={() => {setTrainerState(0)}}>List</button>
                <button onClick={() => {setTrainerState(1)}}>Trainer</button>
            </div>
            {trainerState === 0 ? (
                <AlgorithmsList
                    algorithmsData={algorithmsData}
                />
                ) :
                <>

                </>
            }
        </>
    );
}