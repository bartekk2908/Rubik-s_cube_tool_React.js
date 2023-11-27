
export function ScrambleField({ scramble, updateScramble }) {

    return (
            <>
                <div>
                    <button
                        className={"custom-button orange-button"}
                        onClick={updateScramble}
                    >next scramble</button>
                </div>
                <div style={{fontSize: 20}}>{scramble}</div>
            </>
    );
}
