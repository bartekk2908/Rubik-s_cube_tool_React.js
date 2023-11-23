
// Takes time in 10 ms unit and gives string of formatted time to display
export function formatTime(time, withFullMilliseconds) {
    const hours = Math.floor(time / 360_000);
    const minutes = Math.floor((time % 360_000) / 6_000);
    const seconds = Math.floor((time % 6_000) / 100);
    const milliseconds = Math.floor(time % 100);

    return (
        (hours ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.` :
            (minutes ? `${minutes}:${seconds.toString().padStart(2, '0')}.` :
                `${seconds}.`)
            + (withFullMilliseconds ? milliseconds.toString().padStart(2, '0') : Math.floor(milliseconds/10)))
    );
}

// Takes training state dictionary and gives list of dictionary's keys that represent wanted value
export function giveListOfChosenAlgorithms(wantedState, algorithmType, trainingStateDict, algorithmsData) {
    let listOfChosen = [];
    for (const pair of trainingStateDict.entries()) {
        if (pair[1] === wantedState && algorithmsData[pair[0]][23] === algorithmType) {
            listOfChosen.push(pair[0]);
        }
    }
    return (listOfChosen);
}

// Definition of color for numerical value
export const colorOfNumber = {
    0: "grey",
    1: "white",
    2: "orange",
    3: "blue",
    4: "yellow",
    5: "red",
    6: "green",
};

// Gives number of opposite color at Rubik's cube for given color
export function giveOppositeColor(color) {
    return (color + 2) % 6 + 1;
}

// Gives number of color that is on the left side by known color on top and color on front
export function giveColorOnLeft(topColor, frontColor) {
    const allowedColors = [1, 2, 3, 4, 5, 6];
    const step = topColor % 2 === 1 ? (1) : (5);
    return (
        allowedColors[(frontColor - 1 + step) % 6] === topColor ||
        allowedColors[(frontColor - 1 + step) % 6] === giveOppositeColor(topColor) ?
            (allowedColors[(frontColor - 1 + step * 2) % 6]) : (allowedColors[(frontColor - 1 + step) % 6])
    );
}
