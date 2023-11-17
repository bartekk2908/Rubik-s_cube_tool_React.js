
export function ScrambleField({ scramble, updateScramble }) {

    return (
            <>
                <div>
                    <button onClick={updateScramble}>next scramble</button>
                </div>
                <div>{scramble}</div>
            </>
    );
}
