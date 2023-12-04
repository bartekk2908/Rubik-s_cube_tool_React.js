import {useEffect, useState} from "react";

import {ScrambleField} from "./ScrambleField";
import {Stats} from "./Stats";
import {ResultsList} from "./ResultsList";
import {formatTime, giveListOfChosenAlgorithms} from "./functions";
import {db} from "./db";

import sound1 from "./sounds/notification-sound-1.mp3"; //https://pixabay.com/sound-effects/
import sound2 from "./sounds/notification-sound-2.mp3";

export function Timer({ holdingSpaceTime, determineVisibilityFunc, scrambleLength, results, algorithmsData, trainingStateDict, outerPopupOpened, settings }) {
    const [scrambleSequence, setScrambleSequence] = useState(generateClassicScrambleSequence(scrambleLength));
    const [timerTab, setTimerTab] = useState(0);
    // 0 - Normal
    // 1 - PLL
    // 2 - OLL

    // While timer tab is PLL or OLL
    const [algorithmId, setAlgorithmId] = useState(null);

    // Time in 10 ms unit
    const [time, setTime] = useState( 0);
    const [startTime, setStartTime] = useState(Date.now());

    const [timerState, setTimerState] = useState(0);
    // -1 - can't start because of zero chosen algorithms (only for PLL and OLL tab)
    // 0 - normal state
    // 1 - is ready to start inspection (holding space but do not have to)
    // 2 - inspection time
    // 3 - is ready to start timer (holding space)
    // 4 - timer is running / solving time
    // 5 - after solve to confirm solve was ok or not

    const [spacePressed, setSpacePressed] = useState(false);
    const [holdingSpaceTimeout, setHoldingSpaceTimeout] = useState(null);
    const [escPressed, setEscPressed] = useState(false);

    const withInspection = settings.get("withInspection") ?? false;
    const [inspectionTime, setInspectionTime] = useState(1500);
    const [inspectionStartTime, setInspectionStartTime] = useState(Date.now());

    const [inspectionState, setInspectionState] = useState(0);
    // 0 - no inspection now
    // 1 - inspection has started
    // 2 - after 8 seconds
    // 3 - after 12 seconds
    // 4 - after 15 seconds (+2)
    // 5 - after 17 seconds (DNF)

    const resultListVisible = settings.get("resultList") ?? true;
    const statsVisible = settings.get("stats") ?? true;

    // Running timer
    useEffect(() => {
        determineVisibilityFunc(timerState);
        let intervalId;
        if (timerState === 4) {
            intervalId = setInterval(() => setTime(Math.floor((Date.now() - startTime)/10)), 10);
        }
        return () => clearInterval(intervalId);
    }, [timerState, time]);

    // Running inspection
    useEffect(() => {
        let intervalId;
        if ((timerState === 2) || (timerState === 3 && withInspection)) {
            if (inspectionTime > -200) {
                intervalId = setInterval(() => setInspectionTime(Math.floor((15000 - (Date.now() - inspectionStartTime)) / 10)), 10)
            }
            if (inspectionTime <= -200 && inspectionState === 4) {
                setInspectionState(5);
            } else if (inspectionTime < 0 && inspectionState === 3) {
                setInspectionState(4);
            } else if (inspectionTime < 300 && inspectionState === 2) {
                setInspectionState(3);
            } else if (inspectionTime < 700 && inspectionState === 1) {
                setInspectionState(2);
            }
        }
        return () => clearInterval(intervalId);
    }, [inspectionState, inspectionTime]);

    // Playing sounds
    useEffect(() => {
        if (settings.get("soundEffects") ?? false) {
            if (inspectionState === 2) {
                new Audio(sound1).play();
            } else if (inspectionState === 3) {
                new Audio(sound2).play();
            }
        }
    }, [inspectionState]);

    function startTimer() {
        resetTimer();
        setTimerState(4);
        setStartTime(Date.now());
    }

    function saveResult(plusTwoTurn = false, dnf = false) {
        setTimerState(0);
        if (timerTab === 0) {
            if (dnf) {
                addNormalResult(false, false, true);
            } else {
                switch (inspectionState) {
                    case 4:
                        addNormalResult(true, plusTwoTurn, false);
                        break;
                    case 5:
                        addNormalResult(false, false, true);
                        break;
                    default:
                        addNormalResult(false, plusTwoTurn, false);
                }
            }
        } else {
            addPllOllResult(algorithmsData[algorithmId][0], algorithmsData[algorithmId][23], algorithmsData[algorithmId][1]);
        }
        updateScramble();
        setTimeout(() => {
            setTime(time);
        }, 1);
    }

    function resetTimer() {
        setTime(0);
    }

    function startInspection() {
        resetInspection();
        setInspectionState(1);
        setTimerState(2);
        setInspectionStartTime(Date.now());
    }

    function resetInspection() {
        setInspectionTime(1500);
    }

    useEffect(() => {
        setInspectionState(0);
    }, [withInspection]);

    // Saving result after stopped timer
    async function addNormalResult(plusTwoInspection, plusTwoTurn, dnf) {
        try {
            const date = new Date();
            const id = await db.solving_results.add({
                scramble: scrambleSequence,
                time,
                plusTwoInspection,
                plusTwoTurn,
                dnf,
                date: `${date.getHours().toString().padStart(2, '0')}:` +
                    `${date.getMinutes().toString().padStart(2, '0')}:` +
                    `${date.getSeconds().toString().padStart(2, '0')} ` +
                    `${date.getDate().toString().padStart(2, '0')}-` +
                    `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
                    `${date.getFullYear()}`,
            });
        } catch (error) {
            console.log("Error: " + error);
        }
    }
    async function addPllOllResult(algorithmName, algorithmType, algorithmSequence){
        try {
            const date = new Date();
            const id = await db.pll_oll_training_results.add({
                scramble: scrambleSequence,
                time,
                algorithmName,
                algorithmType,
                algorithmSequence,
                date: `${date.getHours().toString().padStart(2, '0')}:` +
                    `${date.getMinutes().toString().padStart(2, '0')}:` +
                    `${date.getSeconds().toString().padStart(2, '0')} ` +
                    `${date.getDate().toString().padStart(2, '0')}-` +
                    `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
                    `${date.getFullYear()}`,
            });
        } catch (error) {
            console.log("Error: " + error);
        }
    }

    // Operations when spacePressed status is changed
    useEffect(() => {
        if (spacePressed) {
            if (timerState === 4) {
                if (timerTab === 0) {
                    if (inspectionState !== 5) {
                        setTimerState(5);
                    } else {
                        saveResult(false, true);
                    }
                } else {
                    saveResult();
                }
            } else if (timerState === 0 && withInspection && timerTab === 0) {
                setTimerState(1);
            } else if ((timerState === 0) || timerState === 2) {
                setHoldingSpaceTimeout(setTimeout(() => {setTimerState(3);}, holdingSpaceTime));
            } else if (timerState === 5) {
                saveResult();
            }
        } else {
            clearTimeout(holdingSpaceTimeout);
            if (timerState === 1) {
                startInspection();
            } else if (timerState === 3) {
                startTimer();
            }
        }
    }, [spacePressed]);

    // Operations when escPressed status is changed
    useEffect(() => {
        if (escPressed) {
            clearTimeout(holdingSpaceTimeout);
            if (timerState === 1 || timerState === 2 || timerState === 3) {
                setTimerState(0);
            } else if (timerState === 4 || timerState === 5) {
                saveResult(false, true);
            }
        }
    }, [escPressed]);

    // Handling key down and key up
    useEffect(() => {
        function handleKeyDown(event) {
            if (event.key === ' ' && !event.repeat) {
                setSpacePressed(true);
            } else if (event.key === 'Escape' && !event.repeat) {
                setEscPressed(true);
            }
        }
        function handleKeyUp(event) {
            if (event.key === ' ') {
                setSpacePressed(false);
            }
            else if (event.key === 'Escape') {
                setEscPressed(false);
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    const inspectionMessages = [
        " ",
        " ",
        "8!",
        "12!",
        "15!!!",
        "17!!!",
    ];

    function generateClassicScrambleSequence(n) {
        const faces = ['F', 'B', 'R', 'L', 'U', 'D'];
        const modifiers = ["", "'", "2"];
        let scramble = "";
        let face = "";
        let lastFace = "";
        let nextToLastFace = "";
        for (let i = 0; i<n; i++) {
            // choose again if:
            // chosen face is the same as last face
            // OR
            // chosen face is the same as next to last face and last face is opposite face to chosen face
            do {
                face = faces[Math.floor(Math.random()*faces.length)];
            } while (lastFace === face || (nextToLastFace === face && lastFace === (faces.indexOf(face)%2 ? faces[faces.indexOf(face)-1] : faces[faces.indexOf(face)+1])))
            nextToLastFace = lastFace;
            lastFace = face;
            scramble += face + modifiers[Math.floor(Math.random()*modifiers.length)] + " ";
        }
        return scramble;
    }

    function generateAlgorithmScrambleSequence() {
        let wantedStates = [];
        if ((settings.get("learningGroup") ?? true) || (settings.get("finishedGroup") ?? false )) {
            if (settings.get("learningGroup")) {
                wantedStates = wantedStates.concat([1]);
            }
            if (settings.get("finishedGroup")) {
                wantedStates = wantedStates.concat([2]);
            }
        } else {
            wantedStates = wantedStates.concat([0, 1, 2]);
        }

        const listOfChosen = giveListOfChosenAlgorithms(wantedStates, (timerTab === 1 ? "PLL" : "OLL"), trainingStateDict, algorithmsData);
        if (listOfChosen.length === 0) {
            return "";
        }
        const id = listOfChosen[Math.floor(Math.random()*listOfChosen.length)];
        setAlgorithmId(id);

        const AUF = ['', 'U ', 'U2 ', "U' "];
        const algorithm = algorithmsData[id][1];
        return (
            AUF[Math.floor(Math.random()*AUF.length)] +
            giveReversedSequence(algorithm) +
            AUF[Math.floor(Math.random()*AUF.length)]
        );
    }

    function giveReversedSequence(sequence) {
        const moves = removeRotations(replaceWideMoves(sequence.split(" ")));

        let reversedSequence = "";
        for (let i=0; i<moves.length; i++) {
            if (moves[i] !== "") {
                if (moves[i].slice(-1) === "'") {
                    reversedSequence = moves[i].slice(0, -1) + " " + reversedSequence;
                } else if (moves[i].slice(-1) === "2") {
                    reversedSequence = moves[i] + " " + reversedSequence;
                } else {
                    reversedSequence = moves[i] + "' " + reversedSequence;
                }
            }
        }
        return reversedSequence;
    }

    function replaceWideMoves(array) {
        const changes = new Map ([
            ["r", ["L", "x"]],
            ["l", ["R", "x'"]],
            ["u", ["D", "y"]],
            ["d", ["U", "y'"]],
            ["f", ["B", "z"]],
            ["b", ["F", "z'"]],
            ["M", ["R", "L'"]],
            ["E", ["U", "D'"]],
            ["S", ["B", "F'"]],
        ]);
        const n = array.length;
        for(let i=n-1; i>=0; i--) {
            const currentLetter = array[i];
            if ((Array.from(changes.keys())).includes(currentLetter[0])) {
                let forReplace = changes.get(currentLetter[0]);
                if (currentLetter[1] === "'") {
                    forReplace = [forReplace[0] + "'", (forReplace[1][1] ? forReplace[1][0] : forReplace[1] + "'")];
                } else if (currentLetter[1] === "2") {
                    forReplace = [forReplace[0] + "2", forReplace[1] + "2"];
                }
                array = array.slice(0, i).concat(forReplace).concat(array.slice(i + 1).join(" ").split(" "));
            }
        }
        return array;
    }

    function removeRotations(array) {
        const rotations = new Map([
            ["x", ["F", "D", "B", "U"]],
            ["y", ["F", "R", "B", "L"]],
            ["z", ["U", "L", "D", "R"]],
        ]);
        const n = array.length;
        for(let i=n-1; i>=0; i--) {
            const currentLetter = array[i];
            if ((Array.from(rotations.keys())).includes(currentLetter[0])) {
                let letters = rotations.get(currentLetter[0])
                if (currentLetter[1] === "'") {
                    letters = letters.slice().reverse();
                }
                const l1 = letters[0];
                const l2 = letters[1];
                const l3 = letters[2];
                const l4 = letters[3];
                array = array.slice(0, i).concat(array.slice(i + 1).join(" ").replace(new RegExp(l1,"g"), "%")
                    .replace(new RegExp(l4,"g"), l1).replace(new RegExp(l3,"g"), l4)
                    .replace(new RegExp(l2,"g"), l3).replace(/%/g, l2).split(" "));
                if (currentLetter[1] === "2") {
                    array = array.slice(0, i).concat(array.slice(i).join(" ")
                        .replace(new RegExp(l1,"g"), "%").replace(new RegExp(l4,"g"), l1)
                        .replace(new RegExp(l3,"g"), l4).replace(new RegExp(l2,"g"), l3)
                        .replace(/%/g, l2).split(" "));
                }
            }
        }
        return array;
    }

    function updateScramble() {
        if (timerTab === 0) {
            setScrambleSequence(generateClassicScrambleSequence(scrambleLength));
        } else  {
            const scr = generateAlgorithmScrambleSequence();
            if (scr === "") {
                setTimerState(-1);
            } else {
                setScrambleSequence(scr);
            }
        }
    }

    useEffect(() => {
        setTimerState(0);
        updateScramble();
    }, [timerTab, settings.get("learningGroup"), settings.get("finishedGroup")]);

    return (
        <div className="timer-tab">
            {timerState <= 0 ? (
                <div className={"tabs-menu"}>
                    <button
                        className={"custom-button orange-button big-button"}
                        disabled={!timerTab}
                        onClick={() => {setTimerTab(0)}}
                    >3x3</button>
                    <button
                        className={"custom-button orange-button big-button"}
                        disabled={timerTab === 1}
                        onClick={() => {setTimerTab(1)}}
                    >PLL</button>
                    <button
                        className={"custom-button orange-button big-button"}
                        disabled={timerTab === 2}
                        onClick={() => {setTimerTab(2)}}
                    >OLL</button>
                </div>
            ) : (
                <>
                    <br/><br/><br/><br/><br/><br/>
                </>
            )}
            <div className={"time"} style={{color: (spacePressed ? (timerState === 3 ? "green" : "yellow") : (timerState === 2 ? "red" : "" ))}}>
                {((timerState === 2 || (timerState === 3 && withInspection && timerTab === 0)) ? (inspectionState < 4 ? Math.ceil(inspectionTime/100) : (inspectionState === 4 ? "+2" : "DNF")) :
                    ((timerState === 3 && (!withInspection || timerTab !== 0)) || (timerState === 1 )) ? "0.0" :
                        formatTime(time, (timerState !== 4)))}
            </div>
            {timerState === 2 || timerState === 3 ? inspectionMessages[inspectionState] : ""}
            {timerState <= 0 ? (
                <div className={"under-timer-container"}>
                    {resultListVisible ? (
                        <ResultsList
                            results={results}
                            timerTab={timerTab}
                            outerPopupOpened={outerPopupOpened}
                        />
                    ) : ""}
                    {statsVisible ? (
                        <Stats
                            results={results}
                            timerTab={timerTab}
                            algorithmsData={algorithmsData}
                        />
                    ) : ""}
                    {timerState === -1 ? (
                        <div>No algorithms selected</div>
                    ) : (
                        <ScrambleField
                            scramble={scrambleSequence}
                            updateScramble={updateScramble}
                        />
                    )}
                </div>
            ) : ""}
            {timerState === 5 ? (
                <div className={"under-timer-container"}>
                    <button
                        onClick={() => {saveResult()}}
                        className={"custom-button orange-button"}
                    >OK</button>
                    <button
                        onClick={() => {saveResult(true, false)}}
                        className={"custom-button orange-button"}
                    >+2</button>
                    <button
                        onClick={() => {saveResult(false, true)}}
                        className={"custom-button orange-button"}
                    >DNF</button>
                </div>
            ) : ""}
        </div>
    );
}
