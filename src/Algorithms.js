import {OneAlgorithm} from "./OneAlgorithm";

export function Algorithms() {

    const pieceScheme = [
        [0, 4, 4, 4, 0],
        [4, 4, 4, 4, 4],
        [4, 4, 4, 4, 4],
        [4, 4, 4, 4, 4],
        [0, 4, 4, 4, 0],
    ];

    return (
        <div className={"algorithm-container"}>
            <OneAlgorithm piecesScheme={pieceScheme} colorOnTop={4}/>
        </div>
    );
}



