import { useState, useEffect } from "react";
import Dexie from "dexie";
import './App.css';

export default function App() {
    return (
        <div className="Timer">
            <Timer holdingSpaceTime={500}/>
        </div>
    );
}

function ScrambleField({ n, isVisible }) {
    const [scrambleText, setScrambleText] = useState(generateScramble(n));

    useEffect(() => {
        setScrambleText(generateScramble(n));
    }, [isVisible]);

    return (
        isVisible ? (
        <>
            <div>
                <button onClick={() => setScrambleText(generateScramble(n))}>next scramble</button>
            </div>
            <div>{scrambleText}</div>
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

    const hours = Math.floor(time / 360_000);
    const minutes = Math.floor((time % 360_000) / 6_000);
    const seconds = Math.floor((time % 6_000) / 100);
    const milliseconds = Math.floor(time % 100);

    // running timer
    useEffect(() => {
        let intervalId;
        if (timerState === 4) {
            intervalId = setInterval(() => setTime(Math.floor((Date.now() - startTime)/10)), 10);
        } else if (timerState) {
            intervalId = setInterval(() => setTime(), 10)
        }
        return () => clearInterval(intervalId);
    }, [timerState, time]);

    function startTimer() {
        resetTimer();
        setTimerState(4);
        setStartTime(Date.now());
    }

    function stopTimer() {
        setTimerState(0);
    }

    function resetTimer() {
        setTime(0);
    }

    // operations when spacePressed status is changed
    useEffect(() => {
        if (spacePressed) {
            if (timerState === 4) {
                stopTimer();
            } else if (timerState === 0 && withPreinspection) {
                setTimerState(1);
            } else if ((timerState === 0 && !withPreinspection) || timerState === 2) {
                setHoldingSpaceTimeout(setTimeout(() => {setTimerState(3);}, holdingSpaceTime));
            }
        } else {
            clearTimeout(holdingSpaceTimeout);
            if (timerState === 1) {
                setTimerState(2);
            } else if (timerState === 3) {
                startTimer();
            }
        }
    }, [spacePressed]);

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

    function changePreinspectionState() {
        setWithPreinspection(!withPreinspection);
    }

    return (
        <>
            <ScrambleField n={20} isVisible={timerState === 0}/>
            <div style={{color: (spacePressed ? (timerState === 3 ? "green" : "yellow") : (timerState === 2 ? "red" : "" )), fontWeight: "bold"}}>
                {timerState === 3 && !withPreinspection ? "0.0" : (hours ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.` :
                    (minutes ? `${minutes}:${seconds.toString().padStart(2, '0')}.` :
                        `${seconds}.`) + (timerState === 4 ? Math.floor(milliseconds/10) : milliseconds.toString().padStart(2, '0')))}
            </div>
            {/* <button onClick={timerState === 4 ? stopTimer : startTimer}>{timerState === 4 ? "Stop" : "Start"}</button> */}
            {timerState === 0 ? (<><input type="checkbox" checked={withPreinspection} onChange={changePreinspectionState}/>preinspection</>) : ""}

        </>
    );
}

