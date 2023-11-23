import {formatTime} from "./extra_functions";
import {db} from "./db";

export function ResultsList({ results, scrambleType }) {

    function resetSession() {
        if (scrambleType === 0) {
            db.normal_solving_results.clear();
        } else if (scrambleType === 1) {
            db.pll_oll_results.where("algorithmType").equals("PLL").delete();
        } else {
            db.pll_oll_results.where("algorithmType").equals("OLL").delete();
        }
    }

    return (
        <div className={"results-list"}>
            <button className={"custom-button"} onClick={resetSession}>X</button>
            <ol style={{display: "flex", flexDirection: "column-reverse"}}>
                {results[scrambleType]?.map((result) => {
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
