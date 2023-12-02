import {useState} from "react";
import {formatTime} from "./extra_functions";
import {PopupWindow} from "./PopupWindow";
import {db} from "./db";

export function Result({ result, timerTab }) {
    const [resultPopupOpened, setResultPopupOpened] = useState(false);

    return (
        <li key={result.id}>
            <button
                className={"custom-button orange-button"}
                style={{width: "140px"}}
                disabled={resultPopupOpened}
                onClick={() => {setResultPopupOpened(true)}}
            >
                {(result.dnf ? "DNF (" : "") +
                    formatTime(result.time + (result.plusTwoInspection ? 200 : 0) + (result.plusTwoTurn ? 200 : 0), true) +
                    (result.plusTwoInspection || result.plusTwoTurn ? "+" : "") +
                    (result.dnf ? ")" : "")}
            </button>
            <PopupWindow trigger={resultPopupOpened} closeFunc={() => setResultPopupOpened(false)}>
                <div className={"popup-inner-content"}>
                    {timerTab ? (
                        <>
                            <div>
                                name: <b> {result.algorithmName} </b>
                            </div>
                            <div>
                                sequence: <b> {result.algorithmSequence} </b>
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <input
                                    type={"checkbox"}
                                    checked={result.plusTwoInspection}
                                    onChange={() => {
                                        if (result.plusTwoInspection) {
                                            db.solving_results.update(result.id, {plusTwoInspection: false});
                                        } else {
                                            db.solving_results.update(result.id, {plusTwoInspection: true, dnf: false});
                                        }
                                    }}
                                /> +2 (inspection)
                            </div>
                            <div>
                                <input
                                    type={"checkbox"}
                                    checked={result.plusTwoTurn}
                                    onChange={() => {
                                        if (result.plusTwoTurn) {
                                            db.solving_results.update(result.id, {plusTwoTurn: false});
                                        } else {
                                            db.solving_results.update(result.id, {plusTwoTurn: true, dnf: false});
                                        }
                                    }}
                                /> +2 (one turn)
                            </div>
                            <div>
                                <input
                                    type={"checkbox"}
                                    checked={result.dnf}
                                    onChange={() => {
                                        if (result.dnf) {
                                            db.solving_results.update(result.id, {dnf: false});
                                        } else {
                                            db.solving_results.update(result.id, {dnf: true, plusTwoInspection: false, plusTwoTurn: false});
                                        }
                                    }}
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
                    <div>
                        date: <b> {result.date} </b>
                    </div>
                    <br/>
                </div>
                <button
                    onClick={() => {timerTab ? (db.pll_oll_training_results.delete(result.id)) : (db.solving_results.delete(result.id)); setResultPopupOpened(false)}}
                    className={"custom-button red-button"}
                >delete result</button>
            </PopupWindow>
        </li>
    );
}
