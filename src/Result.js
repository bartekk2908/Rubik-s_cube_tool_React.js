import {useState} from "react";
import {formatTime} from "./extra_functions";
import {PopupWindow} from "./PopupWindow";
import {db} from "./db";

export function Result({ result, timerTab }) {
    const [popupOpened, setPopupOpened] = useState(false);

    return (
        <li key={result.id}>
            <button
                className={"custom-button orange-button"}
                style={{width: "140px", }}
                onClick={() => {setPopupOpened(true)}}
            >
                {(result.dnf ? "DNF (" : "") +
                    formatTime(result.time + (result.plusTwoInspection ? 200 : 0) + (result.plusTwoTurn ? 200 : 0), true) +
                    (result.plusTwoInspection || result.plusTwoTurn ? "+" : "") +
                    (result.dnf ? ")" : "")}
            </button>
            <PopupWindow trigger={popupOpened} closeFunc={() => setPopupOpened(false)}>
                <div className={"popup-inner-content"}>
                    {timerTab ? "" : (
                        <>
                            <div>
                                <input
                                    type={"checkbox"}
                                    checked={result.plusTwoInspection}
                                    onChange={() => {db.solving_results.update(result.id, {plusTwoInspection: !result.plusTwoInspection})}}
                                /> +2 (inspection)
                            </div>
                            <div>
                                <input
                                    type={"checkbox"}
                                    checked={result.plusTwoTurn}
                                    onChange={() => {db.solving_results.update(result.id, {plusTwoTurn: !result.plusTwoTurn})}}
                                /> +2 (one turn)
                            </div>
                            <div>
                                <input
                                    type={"checkbox"}
                                    checked={result.dnf}
                                    onChange={() => {db.solving_results.update(result.id, {dnf: !result.dnf})}}
                                /> DNF
                            </div>
                        </>
                    )}
                    <br/>
                    <div>
                        time: <b> {formatTime(result.time, true)} </b>
                    </div>
                    <br/>
                    <div>
                        scramble: <b> {result.scramble} </b>
                    </div>
                    <br/>
                </div>
                <button
                    onClick={() => {timerTab ? (db.pll_oll_training_results.delete(result.id)) : (db.solving_results.delete(result.id)); setPopupOpened(false)}}
                    className={"custom-button red-button"}
                >delete result</button>
            </PopupWindow>
        </li>
    );
}
