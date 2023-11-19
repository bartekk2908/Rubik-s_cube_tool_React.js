import {useEffect, useState} from "react";

import {ScrambleField} from "./ScrambleField";
import {Stats} from "./Stats";
import {ResultsList} from "./ResultsList";
import {formatTime} from "./extra_functions";
import {db} from "./db";

export function Timer({ holdingSpaceTime, giveTimerStateFunc, scrambleLength, records, algorithmsData, learningStateDict }) {
    const [scramble, setScramble] = useState(generateNormalScramble(scrambleLength));
    const [scrambleType, setScrambleType] = useState(0);
    // 0 - Normal
    // 1 - PLL
    // 2 - OLL

    // time in 10 ms unit
    const [time, setTime] = useState( 0);
    const [startTime, setStartTime] = useState(Date.now());

    const [timerState, setTimerState] = useState(0);
    // 0 - normal state
    // 1 - is ready to start inspection (holding space but do not have to)
    // 2 - inspection time
    // 3 - is ready to start timer (holding space)
    // 4 - timer is running / solving time

    const [spacePressed, setSpacePressed] = useState(false);
    const [holdingSpaceTimeout, setHoldingSpaceTimeout] = useState(null);
    const [escPressed, setEscPressed] = useState(false);

    const [withInspection, setWithInspection] = useState(false);
    const [inspectionTime, setInspectionTime] = useState(1500);
    const [inspectionStartTime, setInspectionStartTime] = useState(Date.now());
    const [inspectionState, setInspectionState] = useState(0);
    // 0 - no inspection now
    // 1 - inspection has started
    // 2 - after 8 seconds
    // 3 - after 12 seconds
    // 4 - after 15 seconds (+2)
    // 5 - after 17 seconds (DNF)

    // running timer
    useEffect(() => {
        giveTimerStateFunc(timerState);
        let intervalId;
        if (timerState === 4) {
            intervalId = setInterval(() => setTime(Math.floor((Date.now() - startTime)/10)), 10);
        }
        return () => clearInterval(intervalId);
    }, [timerState, time]);

    // running inspection
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

    function startTimer() {
        resetTimer();
        setTimerState(4);
        setInspectionState(0);
        setStartTime(Date.now());
    }

    function stopTimer(plus_two, dnf) {
        addTimerRecord(plus_two, dnf);
        setTimerState(0);
        updateScramble();
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

    function changeInspection() {
        setWithInspection(!withInspection);
    }

    async function addTimerRecord(plus_two, dnf) {
        try {
            const id = await db.times.add({
                scramble,
                time,
                plus_two,
                dnf,
            });
        } catch (error) {
            console.log("Error: " + error);
        }
    }

    // operations when spacePressed status is changed
    useEffect(() => {
        if (spacePressed) {
            if (timerState === 4) {
                stopTimer(false, false);
            } else if (timerState === 0 && withInspection) {
                setTimerState(1);
            } else if ((timerState === 0 && !withInspection) || timerState === 2) {
                setHoldingSpaceTimeout(setTimeout(() => {setTimerState(3);}, holdingSpaceTime));
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

    // operations when escPressed status is changed
    useEffect(() => {
        if (escPressed) {
            clearTimeout(holdingSpaceTimeout);
            if (timerState === 1 || timerState === 2 || timerState === 3) {
                setTimerState(0);
            } else if (timerState === 4) {
                stopTimer(false, true);
            } else if (timerState === 0) {
                // set DNF
            }
        }
    }, [escPressed]);

    // handling keyDown and keyUp
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

    const inspectionComs = [
        " ",
        " ",
        "8!",
        "12!",
        "15!!!",
        "17!!!",
    ];

    function generateNormalScramble(n) {
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

    function generateAlgorithmScramble() {
        const listOfChosen = giveListOfChosenAlgorithms(1);
        const id = listOfChosen[Math.floor(Math.random()*listOfChosen.length)];

        const AUF = ['', 'U', 'U2', "U'"];
        const algorithm = algorithmsData[id][1];
        return (AUF[Math.floor(Math.random()*AUF.length)] + giveReversedSequence(algorithm) + AUF[Math.floor(Math.random()*AUF.length)]);
    }

    function giveReversedSequence(sequence) {
        const moves = sequence.split(" ");

        let reversedSequence = "";
        for (let i=0; i<moves.length; i++) {
            if (moves[i].slice(-1) === "'") {
                reversedSequence = moves[i].slice(0, -1) + " " + reversedSequence;
            } else if (moves[i].slice(-1) === "2") {
                reversedSequence = moves[i] + " " + reversedSequence;
            } else {
                reversedSequence = moves[i] + "' " + reversedSequence;
            }
        }
        return reversedSequence;
    }

    function giveListOfChosenAlgorithms(wantedValue) {
        let listOfChosen = [];
        for (const pair of learningStateDict.entries()) {
            if (pair[1] === wantedValue) {
                listOfChosen.push(pair[0]);
            }
        }
        return (listOfChosen);
    }

    function updateScramble() {
        if (scrambleType === 0) {
            setScramble(generateNormalScramble(scrambleLength));
        } else  {
            setScramble(generateAlgorithmScramble());
        }
    }

    return (
        <>
            {timerState === 0 ? (
                <>
                    <div>
                        <button onClick={() => {setScrambleType(0)}}>Normal</button>
                        <button onClick={() => {setScrambleType(1)}}>PLL</button>
                        <button onClick={() => {setScrambleType(2)}}>OLL</button>
                    </div>
                    <ScrambleField
                        scramble={scramble}
                        updateScramble={updateScramble}
                    />
                </>
            ) : ""}
            <div style={{color: (spacePressed ? (timerState === 3 ? "green" : "yellow") : (timerState === 2 ? "red" : "" )), fontWeight: "bold"}}>
                {((timerState === 2 || (timerState === 3 && withInspection)) ? (inspectionState < 4 ? Math.ceil(inspectionTime/100) : (inspectionState === 4 ? "+2" : "DNF")) :
                    ((timerState === 3 && !withInspection) || (timerState === 1 )) ? "0.0" :
                        formatTime(time, (timerState !== 4)))}
            </div>
            {inspectionComs[inspectionState]}
            {timerState === 0 ? (
                <>
                    <input type="checkbox" checked={withInspection} onChange={changeInspection}/>inspection
                    <div style={{display: "flex"}}>
                        <ResultsList
                            records={records}
                        />
                        <Stats/>
                    </div>
                </>
            ) : ""}
        </>
    );
}