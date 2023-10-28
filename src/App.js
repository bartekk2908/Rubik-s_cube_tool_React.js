import { useState, useEffect } from "react";
import './App.css';
import Dexie from "dexie";
import {useLiveQuery} from "dexie-react-hooks";

const db = new Dexie('SpeedCubeTool');
db.version(1).stores({
    times: '++id, scramble, time, plus_two, dnf',
});

export default function App() {
    const [appState, setAppState] = useState(0);
    // 0 - timer
    // 1 - training CFOP algorithms
    // 2 - analyzing CFOP solves

    return (
        <div className="Timer">
            <Timer holdingSpaceTime={500}/>
        </div>
    );
}

function ScrambleField({ n, isVisible, getScramble }) {
    const [scramble, setScramble] = useState(generateScramble(n));

    useEffect(() => {
        if (isVisible) {
            updateScramble();
        }
    }, [isVisible]);

    function updateScramble() {
        const scr = generateScramble(n);
        setScramble(scr);
        getScramble(scr);
    }

    return (
        isVisible ? (
        <>
            <div>
                <button onClick={updateScramble}>next scramble</button>
            </div>
            <div>{scramble}</div>
        </>
        ) : " "
    );
}

function generateScramble(n) {
    const faces = ['F', 'B', 'R', 'L', 'U', 'D'];
    const modifiers = ["", "'", "2"];
    let scramble = "";
    let face = "";
    let lastFace = "";
    let nextToLastFace = "";
    for (let i = 0; i<n; i++) {
    // choose again if: chosen face is the same as last face OR chosen face is the same as next to last face and last face is opposite face to chosen face
    do {
        face = faces[Math.floor(Math.random()*faces.length)];
    } while (lastFace === face || (nextToLastFace === face && lastFace === (faces.indexOf(face)%2 ? faces[faces.indexOf(face)-1] : faces[faces.indexOf(face)+1])))
    nextToLastFace = lastFace;
    lastFace = face;
    scramble += face + modifiers[Math.floor(Math.random()*modifiers.length)] + " ";
    }
    return scramble;
}

function Timer({ holdingSpaceTime }) {
    const [scramble, setScramble] = useState(null);

    // time in 10 ms unit
    const [time, setTime] = useState( 0);
    const [startTime, setStartTime] = useState(Date.now());

    const [timerState, setTimerState] = useState(0);
    // 0 - normal state
    // 1 - is ready to start preinspection (holding space but do not have to)
    // 2 - preinspection time
    // 3 - is ready to start timer (holding space)
    // 4 - timer is running / solving time

    const [spacePressed, setSpacePressed] = useState(false);
    const [holdingSpaceTimeout, setHoldingSpaceTimeout] = useState(null);
    const [escPressed, setEscPressed] = useState(false);

    const [withPreinspection, setWithPreinspection] = useState(false);
    const [preinspectionTime, setPreinspectionTime] = useState(1500);
    const [preinspectionStartTime, setPreinspectionStartTime] = useState(Date.now());
    const [preinspectionState, setPreinspectionState] = useState(0);
    // 0 - no preinspection now
    // 1 - preinspection has started
    // 2 - after 8 seconds
    // 3 - after 12 seconds
    // 4 - after 15 seconds (+2)
    // 5 - after 17 seconds (DNF)

    const hours = Math.floor(time / 360_000);
    const minutes = Math.floor((time % 360_000) / 6_000);
    const seconds = Math.floor((time % 6_000) / 100);
    const milliseconds = Math.floor(time % 100);

    // running timer
    useEffect(() => {
        let intervalId;
        if (timerState === 4) {
            intervalId = setInterval(() => setTime(Math.floor((Date.now() - startTime)/10)), 10);
        }
        return () => clearInterval(intervalId);
    }, [timerState, time]);

    // running preinspection
    useEffect(() => {
        let intervalId;
        if ((timerState === 2) || (timerState === 3 && withPreinspection)) {
            if (preinspectionTime > -200) {
                intervalId = setInterval(() => setPreinspectionTime(Math.floor((15000 - (Date.now() - preinspectionStartTime)) / 10)), 10)
            }
            if (preinspectionTime <= -200 && preinspectionState === 4) {
                setPreinspectionState(5);
            } else if (preinspectionTime < 0 && preinspectionState === 3) {
                setPreinspectionState(4);
            } else if (preinspectionTime < 300 && preinspectionState === 2) {
                setPreinspectionState(3);
            } else if (preinspectionTime < 700 && preinspectionState === 1) {
                setPreinspectionState(2);
            }
        }
        return () => clearInterval(intervalId);
    }, [preinspectionState, preinspectionTime]);

    function startTimer() {
        resetTimer();
        setTimerState(4);
        setPreinspectionState(0);
        setStartTime(Date.now());
    }

    function stopTimer() {
        setTimerState(0);
    }

    function resetTimer() {
        setTime(0);
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

    function getScramble(scr) {
        setScramble(scr);
    }

    // operations when spacePressed status is changed
    useEffect(() => {
        if (spacePressed) {
            if (timerState === 4) {
                addTimerRecord(false, false);
                stopTimer();
            } else if (timerState === 0 && withPreinspection) {
                setTimerState(1);
            } else if ((timerState === 0 && !withPreinspection) || timerState === 2) {
                setHoldingSpaceTimeout(setTimeout(() => {setTimerState(3);}, holdingSpaceTime));
            }
        } else {
            clearTimeout(holdingSpaceTimeout);
            if (timerState === 1) {
                startPreinspection();
            } else if (timerState === 3) {
                startTimer();
            }
        }
    }, [spacePressed]);

    function startPreinspection() {
        resetPreinspection();
        setPreinspectionState(1);
        setTimerState(2);
        setPreinspectionStartTime(Date.now());
    }

    function resetPreinspection() {
        setPreinspectionTime(1500);
    }

    function changePreinspection() {
        setWithPreinspection(!withPreinspection);
    }

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

    const preinspectionComs = [
        " ",
        " ",
        "8!",
        "12!",
        "15!!!",
        "17!!!",
    ];

    return (
        <>
            <ScrambleField n={20} isVisible={timerState === 0} getScramble={getScramble}/>
            <div style={{color: (spacePressed ? (timerState === 3 ? "green" : "yellow") : (timerState === 2 ? "red" : "" )), fontWeight: "bold"}}>
                {((timerState === 2 || (timerState === 3 && withPreinspection)) ? (preinspectionState < 4 ? Math.ceil(preinspectionTime/100) : (preinspectionState === 4 ? "+2" : "DNF")) :
                ((timerState === 3 && !withPreinspection) || (timerState === 1 )) ? "0.0" :
                (hours ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.` :
                (minutes ? `${minutes}:${seconds.toString().padStart(2, '0')}.` :
                `${seconds}.`) + (timerState === 4 ? Math.floor(milliseconds/10) : milliseconds.toString().padStart(2, '0'))))}
            </div>
            {preinspectionComs[preinspectionState]}
            {/* <button onClick={timerState === 4 ? stopTimer : startTimer}>{timerState === 4 ? "Stop" : "Start"}</button> */}
            {timerState === 0 ? (<><input type="checkbox" checked={withPreinspection} onChange={changePreinspection}/>preinspection</>) : ""}
            {timerState === 0 ? (<TimesList/>) : ""}
        </>
    );
}

function TimesList() {
    const times = useLiveQuery(
        () => db.times.toArray()
    );

    return (
        <ol style={{background: "grey", width: "300px", display: "flex", flexDirection: "column-reverse"}}>
            {times?.map((times) => {
                const time = times.time;
                const hours = Math.floor(time / 360_000);
                const minutes = Math.floor((time % 360_000) / 6_000);
                const seconds = Math.floor((time % 6_000) / 100);
                const milliseconds = Math.floor(time % 100);

                return (
                    <li>
                        <button key={times.id} style={{width: "100px", }}>
                            {(hours ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.` :
                            (minutes ? `${minutes}:${seconds.toString().padStart(2, '0')}.` :
                            `${seconds}.`) + milliseconds.toString().padStart(2, '0'))}
                        </button>
                    </li>
                );
            }
            )}
        </ol>
    );
}
