import { useState, useEffect } from "react";

export default function App() {
    return (
        <>
            <Timer holdingSpaceTime={500}/>
        </>
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
    const [isRunning, setIsRunning] = useState(false);
    const [spacePressed, setSpacePressed] = useState(false);
    const [isReadyToStart, setIsReadyToStart] = useState(false);
    const [holdingSpaceTimeout, setHoldingSpaceTimeout] = useState(null);
    const [startTime, setStartTime] = useState(Date.now());

    const hours = Math.floor(time / 360_000);
    const minutes = Math.floor((time % 360_000) / 6_000);
    const seconds = Math.floor((time % 6_000) / 100);
    const milliseconds = Math.floor(time % 100);

    useEffect(() => {
        let intervalId;
        if (isRunning) {
            intervalId = setInterval(() => setTime(Math.floor((Date.now() - startTime)/10)), 10);
        }
        return () => clearInterval(intervalId);
    }, [isRunning, time]);

    function startTimer() {
        if (!isRunning) {
            resetTimer();
        }
        setIsRunning(true);
        setIsReadyToStart(false);
        setStartTime(Date.now());
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
                setHoldingSpaceTimeout(setTimeout(() => {setIsReadyToStart(true);}, holdingSpaceTime));
            }
        } else {
            if (!isRunning) {
                clearTimeout(holdingSpaceTimeout);
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
    }, []);

    return (
        <>
            <ScrambleField n={20} isVisible={!isRunning && !isReadyToStart}/>
            <div style={{color: (spacePressed ? (isReadyToStart ? "green" : "red") : ""), fontWeight: "bold"}}>
                {isReadyToStart ? "0.0" : (hours ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.` :
                    (minutes ? `${minutes}:${seconds.toString().padStart(2, '0')}.` :
                        `${seconds}.`) + (isRunning ? Math.floor(milliseconds/10) : milliseconds.toString().padStart(2, '0')))}
            </div>
            {/* <button onClick={isRunning ? stopTimer : startTimer}>{isRunning ? "Stop" : "Start"}</button> */}
        </>
    );
}

