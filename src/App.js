import {useState} from "react";
import './App.css';
import * as XLSX from "xlsx";

import {Timer} from "./Timer";
import {AlgorithmsList} from "./AlgorithmsList";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "./db";
import {PopupWindow} from "./PopupWindow";

const pathToExcelFile = "./excel/Algorithms.xlsx";

export default function App() {
    const [moduleState, setModuleState] = useState(0);
    // 0 - timer
    // 1 - training CFOP algorithms

    const [settingsPopupOpened, setSettingsPopupOpened] = useState(false);
    const [settings, setSettings] = useState(
        (localStorage.getItem('settings') === null ? new Map() :
            new Map(JSON.parse(localStorage.getItem('settings'))))
    );
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
        localStorage.setItem("trainingStatesDict", JSON.stringify(Array.from(trainingStatesDict.set(id, value))));
    }

    return (
        <>
            {visibility ? (
                <div className={"app-menu"}>
                    <div className={"app-menu-buttons"}>
                        <button
                            className={"custom-button orange-button"}
                            disabled={!moduleState}
                            onClick={() => {setModuleState(0)}}
                        >Timer</button>
                        <button
                            className={"custom-button orange-button"}
                            disabled={moduleState}
                            onClick={() => {setModuleState(1)}}
                        >Algorithms</button>
                    </div>
                    <div className={"app-settings-button-container"}>
                        <button
                            className={"custom-button orange-button"}
                            onClick={() => {setSettingsPopupOpened(true)}}
                        >Settings</button>
                        <PopupWindow trigger={settingsPopupOpened} closeFunc={() => {setSettingsPopupOpened(false)}}>
                            <div className={"popup-inner-content"}>
                                <div>
                                    <input
                                        type="checkbox"
                                        checked={settings.get("withInspection") ?? false}
                                        onChange={() => {
                                            const temp = settings.get("withInspection") ?? false;
                                            localStorage.setItem("settings", JSON.stringify(Array.from(settings.set("withInspection", !temp))));
                                        }}
                                    /> inspection (for 3x3)
                                </div>
                                <div>
                                    <input
                                        type="checkbox"
                                        checked={settings.get("resultList") ?? true}
                                        onChange={() => {
                                            const temp = settings.get("resultList") ?? true;
                                            localStorage.setItem("settings", JSON.stringify(Array.from(settings.set("resultList", !temp))));
                                        }}
                                    /> results list
                                </div>
                                <div>
                                    <input
                                        type="checkbox"
                                        checked={settings.get("stats") ?? true}
                                        onChange={() => {
                                            const temp = settings.get("stats") ?? true;
                                            localStorage.setItem("settings", JSON.stringify(Array.from(settings.set("stats", !temp))));
                                        }}
                                    /> statistics
                                </div>
                                <div>
                                    <input
                                        type="checkbox"
                                        checked={settings.get("soundEffects") ?? false}
                                        onChange={() => {
                                            const temp = settings.get("soundEffects") ?? false;
                                            localStorage.setItem("settings", JSON.stringify(Array.from(settings.set("soundEffects", !temp))));
                                        }}
                                    /> sound effects
                                </div>
                                <br/>
                                <div>Algorithms:</div>
                                <div>
                                    <input
                                        type="checkbox"
                                        checked={settings.get("learningGroup") ?? true}
                                        onChange={() => {
                                            const temp = settings.get("learningGroup") ?? true;
                                            localStorage.setItem("settings", JSON.stringify(Array.from(settings.set("learningGroup", !temp))));
                                        }}
                                    /> <text className={"learning"} style={{color: "black"}}>learning</text>
                                </div>
                                <div>
                                    <input
                                        type="checkbox"
                                        checked={settings.get("finishedGroup") ?? false}
                                        onChange={() => {
                                            const temp = settings.get("finishedGroup") ?? false;
                                            localStorage.setItem("settings", JSON.stringify(Array.from(settings.set("finishedGroup", !temp))));
                                        }}
                                    /> <text className={"finished"} style={{color: "black"}}>finished</text>
                                </div>
                            </div>
                            <br/>
                        </PopupWindow>
                    </div>
                </div>
            ) : ""}
            {moduleState === 0 ? (
                <Timer
                    holdingSpaceTime={500}
                    determineVisibilityFunc={determineVisibility}
                    scrambleLength={20}
                    results={[normalSolvingResults, PllResults, OllResults]}
                    algorithmsData={algorithmsData}
                    trainingStateDict={trainingStatesDict}
                    outerPopupOpened={settingsPopupOpened}
                    settings={settings}
                />
                ) :
                <AlgorithmsList
                    algorithmsData={algorithmsData}
                    giveTrainingStateFunc={giveTrainingState}
                    trainingStateDict={trainingStatesDict}
                />
            }
        </>

    );
}
