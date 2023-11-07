import {useEffect, useState} from "react";

export function ScrambleField({ n, isVisible, giveScrambleFunc, doUpdate }) {
    const [scramble, setScramble] = useState(generateScramble(n));

    function updateScramble() {
        const scr = generateScramble(n);
        setScramble(scr);
        giveScrambleFunc(scr);
    }

    useEffect(() => {
        if (doUpdate) {
            updateScramble();
        }
    }, [doUpdate]);

    function generateScramble(n) {
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
