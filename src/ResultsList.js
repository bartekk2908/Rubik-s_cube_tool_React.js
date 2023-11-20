

import {formatTime} from "./extra_functions";
import {db} from "./db";

export function ResultsList({ results }) {

    function resetSession() {
        db.normal_solving_results.clear();
    }

    return (
        <div style={{background: "grey", width: "300px"}}>
            <button className={"custom-button"} onClick={resetSession}>X</button>
            <ol style={{display: "flex", flexDirection: "column-reverse"}}>
                {results?.map((result) => {
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