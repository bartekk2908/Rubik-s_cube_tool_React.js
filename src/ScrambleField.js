
export function ScrambleField({ scramble, updateScramble }) {

    return (
            <div>
                <div>
                    <button
                        className={"custom-button orange-button"}
                        onClick={updateScramble}
                    >next scramble</button>
                </div>
                <div className={"scramble-field"}>
                    {scramble}
                </div>
            </div>
    );
}
