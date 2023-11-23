import {formatTime} from "./extra_functions";

export function Stats({ results, scrambleType }) {
    const times = results[scrambleType]?.map((result) => {
        return (
            result.time
        );
    });
    const ao5 = averageOfLastX(5);
    const ao12 = averageOfLastX(12);
    const best = times ? (times.length ? Math.min(...times) : undefined) : undefined;

    // calculating average of x last results without first and last results
    function averageOfLastX(x) {
        let ao = undefined;
        if (times) {
            if (times.length >= x) {
                let lastX = times.slice(-x);
                const maxIndex = lastX.indexOf(Math.max(...lastX));
                lastX.splice(maxIndex, 1);
                const minIndex = lastX.indexOf(Math.min(...lastX));
                lastX.splice(minIndex, 1);
                ao = lastX.reduce((acc, value) => acc + value, 0) / lastX.length;
            }
        }
        return ao;
    }

    return (
        <div className={"stats"}>
            <div>average of 5: {ao5 ? formatTime(Math.round(ao5), true) : "-"}</div>
            <div>average of 12: {ao12 ? formatTime(Math.round(ao12), true) : "-"}</div>
            <div>best: {best ? formatTime(best, true) : "-"}</div>
        </div>
    );
}