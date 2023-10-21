import { useState, useEffect } from "react";

export default function App() {
    return (
        <>
            <ScrambleField n={20}/>
            <TimerField/>
        </>
    );
}

function ScrambleField({ n }) {
    const [scrambleText, setScrambleText] = useState(generateScramble(n));

    return (
        <>
            <div>
                <button onClick={() => setScrambleText(generateScramble(n))}>next scramble</button>
            </div>
            <div>{scrambleText}</div>
        </>
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

function TimerField() {
    // time in 10 ms unit
    const [time, setTime] = useState( 0);
    const [isRunning, setIsRunning] = useState(false);

    const hours = Math.floor(time / 360_000);
    const minutes = Math.floor((time % 360_000) / 6_000);
    const seconds = Math.floor((time % 6_000) / 100);
    const milliseconds = Math.floor(time % 100);

    useEffect(() => {
        let intervalId;
        if (isRunning) {
            intervalId = setInterval(() => setTime(time + 1), 10);
        }
        return () => clearInterval(intervalId);
    }, [isRunning, time])

    function startAndStop() {
        if (!isRunning) {
            resetTime();
        }
        setIsRunning(!isRunning);
    }

    function resetTime() {
        setTime(0);
    }

    return (
        <>
            <div>
                {hours ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}` : (minutes ? `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}` : `${seconds}.${milliseconds.toString().padStart(2, '0')}` )}
            </div>
            <button onClick={startAndStop}>{isRunning ? "Stop" : "Start"}</button>
        </>
    );
}

