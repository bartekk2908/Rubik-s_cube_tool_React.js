import { useState, useEffect } from "react";

export default function App() {
    return (
        <>
            <ScrambleField n={20}/>
            <Timer holdingSpaceTime={500}/>
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

function Timer({ holdingSpaceTime }) {
    // time in 10 ms unit
    const [time, setTime] = useState( 0);
    const [isRunning, setIsRunning] = useState(false);
    const [spacePressed, setSpacePressed] = useState(false);
    const [isReadyToStart, setIsReadyToStart] = useState(false);
    const [myTimeout, setMyTimeout] = useState(null);

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

    function startTimer() {
        if (!isRunning) {
            resetTimer();
        }
        setIsRunning(true);
        setIsReadyToStart(false);
    }

    function stopTimer() {
        setIsRunning(false);
    }

    function resetTimer() {
        setTime(0);
    }

    useEffect(() => {
        if (spacePressed) {
            if (isRunning) {
                stopTimer();
            } else {
                setMyTimeout(setTimeout(() => {setIsReadyToStart(true);}, holdingSpaceTime));
            }
        } else {
            if (!isRunning) {
                clearTimeout(myTimeout);
                if (isReadyToStart) {
                    startTimer();
                }
            }
        }
    }, [spacePressed]);

    useEffect(() => {
        function handleKeyDown(event) {
            if (event.key === ' ' && !event.repeat) {
                setSpacePressed(true);
            }
        }
        function handleKeyUp(event) {
            if (event.key === ' ') {
                setSpacePressed(false);
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [])

    return (
        <>
            <div style={{color: (spacePressed ? (isReadyToStart ? "green" : "red") : ""), fontWeight: "bold"}}>
                {hours ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.` :
                    (minutes ? `${minutes}:${seconds.toString().padStart(2, '0')}.` :
                        `${seconds}.`)}
                {isRunning ? Math.floor(milliseconds/10) : milliseconds.toString().padStart(2, '0')}
            </div>
            <button onClick={isRunning ? stopTimer : startTimer}>{isRunning ? "Stop" : "Start"}</button>
        </>
    );
}

