import {formatTime, averageOfLastX, giveBest} from "./extra_functions";

export function Stats({ results, timerTab }) {
    const times = results[timerTab]?.map((result) => {
        return (
            result.time
        );
    });
    const ao5 = averageOfLastX(5, times);
    const ao12 = averageOfLastX(12, times);
    const averageAll = averageOfLastX(times?.length, times, true);
    const best = giveBest(times);

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
                    <div>best algorithm: {results[timerTab].length !== 0 ? giveBestAlgorithm() : "-"}</div>
                    <div>worst algorithm: {results[timerTab].length !== 0 ? giveWorstAlgorithm() : "-"}</div>
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
