import {formatTime} from "./extra_functions";
import {db} from "./db";

export function ResultsList({ results, timerTab }) {

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
        <div className={"results-list-container"}>
            <button
                className={"custom-button"}
                onClick={resetSession}
            >X</button>
            <ol className={"results-list"}>
                {results[timerTab]?.map((result) => {
                        return (
                            <li key={result.id}>
                                <button className={"custom-button"} style={{width: "100px", }}>
                                    {formatTime(result.time, true)}
                                </button>
                            </li>
                        );
                    }
                )}
            </ol>
        </div>
    );
}
