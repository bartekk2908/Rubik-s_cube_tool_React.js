import {useState} from "react";
import * as XLSX from "xlsx";

import {Algorithm} from "./Algorithm";

const pathToExcelFile = "./excel/PLLs.xlsx";

export function AlgorithmList({colorOnTop =4, colorOnFront = 5}) {
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

    let algorithms = [];

    if (algorithmsData) {
        algorithms = algorithmsData.map((algorithmData, i) => {
            return (
                <div className={"algorithm-container"} key={i}>
                    <Algorithm algorithmData={algorithmData} colorOnTop={colorOnTop} colorOnFront={colorOnFront}/>
                </div>
            );
        });
    }

    return (
        <div className={"algorithms-list"}>
            {algorithms}
        </div>
    );
}
