import {OneAlgorithm} from "./OneAlgorithm";

export function Algorithms() {

    const pieceScheme = [
        [0, 0, 1, 0, 0],
        [1, 0, 0, 1, 0],
        [0, 1, 1, 1, 0],
        [1, 0, 0, 1, 0],
        [0, 0, 1, 0, 0],
    ];

    return (
        <div className={"algorithms-list"}>
            <div className={"algorithm-container"}>
                <OneAlgorithm piecesScheme={pieceScheme} colorOnTop={1}/>
            </div>
            <div className={"algorithm-container"}>
                <OneAlgorithm piecesScheme={pieceScheme} colorOnTop={2}/>
            </div>
            <div className={"algorithm-container"}>
                <OneAlgorithm piecesScheme={pieceScheme} colorOnTop={3}/>
            </div>
            <div className={"algorithm-container"}>
                <OneAlgorithm piecesScheme={pieceScheme} colorOnTop={4}/>
            </div>
            <div className={"algorithm-container"}>
                <OneAlgorithm piecesScheme={pieceScheme} colorOnTop={5}/>
            </div>
            <div className={"algorithm-container"}>
                <OneAlgorithm piecesScheme={pieceScheme} colorOnTop={6}/>
            </div>
        </div>
    );
}



