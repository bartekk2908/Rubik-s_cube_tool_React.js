import {formatTime, averageOfLastX, giveBest} from "./functions";

export function StatsWindow({ results, timerTab, algorithmsData }) {
    const times = results[timerTab]?.map((result) => {
        if (result.dnf) {
            return Infinity;
        }
        let penalty = 0;
        if (result.plusTwoInspection) {
            penalty += 200;
        }
        if (result.plusTwoTurn) {
            penalty += 200;
        }
        return (result.time + penalty);
    });
    const ao5 = averageOfLastX(5, times);
    const ao12 = averageOfLastX(12, times);
    const averageAll = averageOfLastX(times?.length, times, true);
    const best = giveBest(times);

    function giveBestAndWorstAlgorithm() {
        const chosenAlgorithmsData = algorithmsData.filter((algorithmData) => algorithmData[23] === ["", "PLL", "OLL"][timerTab])
        const averages = new Map();
        for (let i=0; i<chosenAlgorithmsData.length; i++) {
            const algorithmTimes = results[timerTab].filter((result) => result.algorithmName === chosenAlgorithmsData[i][0]).map((result) => result.time);
            averages.set(chosenAlgorithmsData[i][0], averageOfLastX(algorithmTimes?.length, algorithmTimes, true))
        }
        console.log(averages);
        let minAlgorithm = undefined;
        let maxAlgorithm = undefined;
        for (const [key, value] of averages.entries()) {
            if (minAlgorithm === undefined && maxAlgorithm === undefined && value !== undefined) {
                minAlgorithm = key;
                maxAlgorithm = key;
            }
            if (averages.get(minAlgorithm) > value) {
                minAlgorithm = key;
            }
            if (averages.get(maxAlgorithm) < value) {
                maxAlgorithm = key;
            }
        }
        return ([minAlgorithm, maxAlgorithm]);
    }


    return (
        <div className={"stats"}>
            {timerTab ? (
                <>
                    <div>best algorithm: {results[timerTab].length !== 0 ? giveBestAndWorstAlgorithm()[0] : "-"}</div>
                    <div>worst algorithm: {results[timerTab].length !== 0 ? giveBestAndWorstAlgorithm()[1] : "-"}</div>
                </>
            ) : (
                <>
                    <div>best: {best ? formatTime(best, true) : "-"}</div>
                    <div>ao5: {ao5 ? formatTime(Math.round(ao5), true) : "-"}</div>
                    <div>ao12: {ao12 ? formatTime(Math.round(ao12), true) : "-"}</div>
                    <div>average: {averageAll ? formatTime(Math.round(averageAll), true) : "-"}</div>
                </>
            )}
        </div>
    );
}
