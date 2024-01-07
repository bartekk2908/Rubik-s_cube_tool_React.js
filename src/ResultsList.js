import {useState, useRef, useEffect} from "react";

import {Result} from "./Result";
import {db} from "./db";
import {PopupWindow} from "./PopupWindow";

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

    // starting with scroll on top
    const scrollContainerRef = useRef(null);
    useEffect(() => {
        const delayTimeout = setTimeout(() => {
            scrollContainerRef.current.scrollTop = -scrollContainerRef.current.scrollHeight;
        }, 200)
        return (() => {
            clearTimeout(delayTimeout);
        });
    }, [results.length]);

    useEffect(() => {
        scrollContainerRef.current.scrollTop = -scrollContainerRef.current.scrollHeight;
    }, [timerTab]);

    return (
        <div className={"results-list-container"} style={{zIndex: (outerPopupOpened ? 4 : 6)}}>
            <div className={"description-inner-text"}>
                {results[timerTab]?.length !== 0 ? (
                    timerTab ? (
                        "time - name"
                    ) : (
                        "time"
                    )
                ) : (
                    "no results yet"
                )}
            </div>
            <ol className={"results-list"} ref={scrollContainerRef}>
                {results[timerTab]?.map((result) => {
                        return (
                            <Result
                                result={result}
                                timerTab={timerTab}
                                key={result.id}
                            />
                        );
                    }
                )}
            </ol>
            {results[timerTab]?.length !== 0 ? (
                <>
                    <button
                        className={"custom-button orange-button"}
                        disabled={deletePopupOpened}
                        onClick={() => {setDeletePopupOpened(true)}}
                        style={{margin: "10px"}}
                    >delete results</button>
                    <PopupWindow trigger={deletePopupOpened} closeFunc={() => {setDeletePopupOpened(false)}}>
                        <div className={"popup-inner-content"}>
                            <br/><br/><br/>
                            <b>Are you sure to delete all results?</b>
                            <br/><br/><br/><br/><br/><br/><br/>
                        </div>
                        <button
                            onClick={() => {resetSession(); setDeletePopupOpened(false)}}
                            className={"custom-button red-button"}
                        >delete all results</button>
                    </PopupWindow>
                </>
            ) : (
                ""
            )}
        </div>
    );
}
