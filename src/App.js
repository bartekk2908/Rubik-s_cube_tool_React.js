import {useState} from "react";
import './App.css';
import * as XLSX from "xlsx";

import {Timer} from "./Timer";
import {AlgorithmsTab} from "./AlgorithmsTab";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "./db";
import {PopupWindow} from "./PopupWindow";

const pathToExcelFile = "./excel/Algorithms.xlsx";

export default function App() {
    const [moduleState, setModuleState] = useState(0);
    // 0 - timer
    // 1 - training CFOP algorithms

    const [helpPopupOpened, setHelpPopupOpened] = useState(false);
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
                            disabled={settingsPopupOpened}
                            onClick={() => {setSettingsPopupOpened(true)}}
                        >Settings</button>
                        <PopupWindow
                            trigger={settingsPopupOpened}
                            closeFunc={() => {setSettingsPopupOpened(false)}}
                        >
                            <div className={"popup-inner-content"}>
                                <div>
                                    <input
                                        type="checkbox"
                                        checked={settings.get("withInspection") ?? false}
                                        onChange={() => {
                                            const temp = settings.get("withInspection") ?? false;
                                            localStorage.setItem("settings", JSON.stringify(Array.from(settings.set("withInspection", !temp))));
                                        }}
                                    /> inspection
                                </div>
                                <div>
                                    <input
                                        type="checkbox"
                                        checked={settings.get("soundEffects") ?? false}
                                        onChange={() => {
                                            const temp = settings.get("soundEffects") ?? false;
                                            localStorage.setItem("settings", JSON.stringify(Array.from(settings.set("soundEffects", !temp))));
                                        }}
                                    /> inspection sound effects
                                </div>
                                <br/>
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
                                        checked={settings.get("colorsMenu") ?? true}
                                        onChange={() => {
                                            const temp = settings.get("colorsMenu") ?? true;
                                            localStorage.setItem("settings", JSON.stringify(Array.from(settings.set("colorsMenu", !temp))));
                                        }}
                                    /> colors menu
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
                                    />
                                    <span
                                        className={"learning"}
                                        style={{color: "black"}}
                                    >learning</span>
                                </div>
                                <div>
                                    <input
                                        type="checkbox"
                                        checked={settings.get("finishedGroup") ?? false}
                                        onChange={() => {
                                            const temp = settings.get("finishedGroup") ?? false;
                                            localStorage.setItem("settings", JSON.stringify(Array.from(settings.set("finishedGroup", !temp))));
                                        }}
                                    />
                                    <span
                                        className={"finished"}
                                        style={{color: "black"}}
                                    >finished</span>
                                </div>
                            </div>
                        </PopupWindow>
                        <button
                            className={"custom-button orange-button"}
                            disabled={helpPopupOpened}
                            onClick={() => {setHelpPopupOpened(true)}}
                        >Help</button>
                        <PopupWindow
                            trigger={helpPopupOpened}
                            closeFunc={() => {setHelpPopupOpened(false)}}
                            height={700}
                            width={1000}
                        >
                            <div className={"popup-inner-content"}>
                                <div className={"description-inner-text"}>
                                    TIMER SHORTCUTS
                                </div>
                                <div>
                                    press [spacebar] key to start inspection
                                </div>
                                <div>
                                    press and hold [spacebar] key to start timer
                                </div>
                                <div>
                                    press [Esc] key to cancel inspection
                                </div>
                                <div className={"description-inner-text"}>
                                    while timer's running:
                                </div>
                                <div>
                                    press [spacebar] key to stop timer
                                </div>
                                <div>
                                    press [Esc] key to cancel solve with DNF result
                                </div>
                                <div className={"description-inner-text"}>
                                    after solve:
                                </div>
                                <div>
                                    press [spacebar] key to (OK) result
                                </div>
                                <div>
                                    press [Esc] key to (DNF) result
                                </div>
                                <div className={"description-inner-text"}>
                                    <br/>
                                </div>
                                <div className={"description-inner-text"}>
                                    ALGORITHMS
                                </div>
                                <div>
                                    click on cube face in CASE column to change case's state
                                </div>
                                <div>
                                    <span
                                        className={"not-being-learned"}
                                        style={{color: "black"}}
                                    >white</span> state - this case wasn't being learned yet
                                </div>
                                <div>
                                    <span
                                        className={"learning"}
                                        style={{color: "black"}}
                                    >yellow</span> state - learning of this case is in progress
                                </div>
                                <div>
                                    <span
                                        className={"finished"}
                                        style={{color: "black"}}
                                    >green</span> state - learning of this case is finished
                                </div>
                            </div>
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
                    outerPopupOpened={settingsPopupOpened || helpPopupOpened}
                    settings={settings}
                />
                ) :
                <AlgorithmsTab
                    algorithmsData={algorithmsData}
                    results={[PllResults, OllResults]}
                    giveTrainingStateFunc={giveTrainingState}
                    trainingStateDict={trainingStatesDict}
                    settings={settings}
                />
            }
        </>

    );
}
