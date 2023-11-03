import {useEffect, useState} from "react";

import {formatTime} from "./extra_functions";
import {db} from "./db";

export function Stats() {
    const [times, setTimes] = useState([]);
    const ao5 = averageOfLastX(5);
    const ao12 = averageOfLastX(12);
    const best = times.length ? Math.min(...times) : undefined;

    useEffect(() => {
        async function getTimerRecords() {
            try {
                const data = await db.times.toArray();
                setTimes(data.map((record) => record.time));
            } catch (error) {
                console.log("Error: " + error);
            }
        }
        getTimerRecords();
    }, []);

    function averageOfLastX(x) {
        let ao = undefined;
        if (times.length >= x) {
            let lastX = times.slice(-x);
            const maxIndex = lastX.indexOf(Math.max(...lastX));
            lastX.splice(maxIndex, 1);
            const minIndex = lastX.indexOf(Math.min(...lastX));
            lastX.splice(minIndex, 1);
            ao = lastX.reduce((acc, value) => acc + value, 0) / lastX.length;
        }
        return ao;
    }

    return (
        <div style={{display: "block"}}>
            <div>average of 5: {ao5 ? formatTime(Math.round(ao5), true) : "-"}</div>
            <div>average of 12: {ao12 ? formatTime(Math.round(ao12), true) : "-"}</div>
            <div>best: {best ? formatTime(best, true) : "-"}</div>
        </div>
    );
}