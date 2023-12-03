
export function ScrambleField({ scramble, updateScramble }) {

    return (
            <div className={"scramble-field"}>
                <div className={"scramble"}>
                    {scramble}
                </div>
                <br/>
                <div>
                    <button
                        className={"custom-button orange-button"}
                        onClick={updateScramble}
                    >next scramble</button>
                </div>
            </div>
    );
}
