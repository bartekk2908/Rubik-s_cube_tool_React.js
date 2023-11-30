import {formatTime} from "./extra_functions";

export function Stats({ results, timerTab }) {
    const times = results[timerTab]?.map((result) => {
        return (
            result.time
        );
    });
    const ao5 = averageOfLastX(5);
    const ao12 = averageOfLastX(12);
    const averageAll = averageOfLastX(times?.length, true);
    const best = times ? (times.length ? Math.min(...times) : undefined) : undefined;

    // calculating average of x last results without best and worst results
    function averageOfLastX(x, withoutBorderTimes=false) {
        let ao = undefined;
        if (times) {
            if (times.length >= x) {
                let lastX = times.slice(-x);
                if (!withoutBorderTimes) {
                    const maxIndex = lastX.indexOf(Math.max(...lastX));
                    lastX.splice(maxIndex, 1);
                    const minIndex = lastX.indexOf(Math.min(...lastX));
                    lastX.splice(minIndex, 1);
                }
                ao = lastX.reduce((acc, value) => acc + value, 0) / lastX.length;
            }
        }
        return ao;
    }

    function giveBestAlgorithm() {
        return results[timerTab].reduce((prev, curr) => prev.time > curr.time ? prev : curr).algorithmName;
    }

    function giveWorstAlgorithm() {
        return results[timerTab].reduce((prev, curr) => prev.time < curr.time ? prev : curr).algorithmName;
    }

    return (
        <div className={"stats"}>
            <div>best: {best ? formatTime(best, true) : "-"}</div>
            {timerTab ? (
                <>
                    <div>best algorithm: {results[timerTab].isEmpty ? giveBestAlgorithm() : "-"}</div>
                    <div>worst algorithm: {results[timerTab].isEmpty ? giveWorstAlgorithm() : "-"}</div>
                </>
            ) : (
                <>
                    <div>ao5: {ao5 ? formatTime(Math.round(ao5), true) : "-"}</div>
                    <div>ao12: {ao12 ? formatTime(Math.round(ao12), true) : "-"}</div>
                </>
            )}
            <div>average: {averageAll ? formatTime(Math.round(averageAll), true) : "-"}</div>
        </div>
    );
}