import {useLiveQuery} from "dexie-react-hooks";

import {formatTime} from "./extra_functions";
import {db} from "./db";

export function ResultsList() {
    const records = useLiveQuery(
        () => db.times.toArray()
    );

    function resetSession() {
        db.times.clear();
    }

    return (
        <div style={{background: "grey", width: "300px"}}>
            <button onClick={resetSession}>X</button>
            <ol style={{display: "flex", flexDirection: "column-reverse"}}>
                {records?.map((record) => {
                        return (
                            <li key={record.id}>
                                <button style={{width: "100px", }}>
                                    {formatTime(record.time, true)}
                                </button>
                            </li>
                        );
                    }
                )}
            </ol>
        </div>
    );
}