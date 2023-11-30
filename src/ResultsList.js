import {Result} from "./Result";
import {db} from "./db";
import {PopupWindow} from "./PopupWindow";
import {useState} from "react";


export function ResultsList({ results, timerTab, outerPopupOpened }) {
    const [deletePopupOpened, setDeletePopupOpened] = useState(false);

    // After click in 'X' button reset saved data of solving or training
    function resetSession() {
        if (timerTab === 0) {
            db.solving_results.clear();
        } else if (timerTab === 1) {
            db.pll_oll_training_results.where("algorithmType").equals("PLL").delete();
        } else {
            db.pll_oll_training_results.where("algorithmType").equals("OLL").delete();
        }
    }

    return (
        <div className={"results-list-container"} style={{zIndex: (outerPopupOpened ? 4 : 6)}}>
            <div className={"description-inner-text"}>
                time:
            </div>
            <ol className={"results-list"}>
                {results[timerTab]?.map((result) => {
                        return (
                            <Result
                                result={result}
                                timerTab={timerTab}
                            />
                        );
                    }
                )}
            </ol>
            <button
                className={"custom-button orange-button"}
                onClick={() => {setDeletePopupOpened(true)}}
                style={{margin: "10px"}}
            >delete results</button>
            <PopupWindow trigger={deletePopupOpened} closeFunc={() => {setDeletePopupOpened(false)}}>
                <div className={"popup-inner-content"}>
                    <br/><br/><br/>
                    <b>Are you sure to delete all results?</b>
                    <br/><br/><br/><br/><br/>
                </div>
                <button
                    onClick={() => {resetSession(); setDeletePopupOpened(false)}}
                    className={"custom-button red-button"}
                >delete all results</button>
            </PopupWindow>
        </div>
    );
}
