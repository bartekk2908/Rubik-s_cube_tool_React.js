import {OneAlgorithm} from "./OneAlgorithm";

export function Algorithms() {

    const pieceScheme = [
        [0, 0, 4, 0, 0],
        [4, 0, 0, 4, 0],
        [0, 4, 4, 4, 0],
        [4, 0, 0, 4, 0],
        [0, 0, 4, 0, 0],
    ];

    return (
        <div className={"algorithms-list"}>
            <div className={"algorithm-container"}>
                <OneAlgorithm piecesScheme={pieceScheme} colorOnTop={4}/>
            </div>
            <div className={"algorithm-container"}>
                <OneAlgorithm piecesScheme={pieceScheme} colorOnTop={4}/>
            </div>
            <div className={"algorithm-container"}>
                <OneAlgorithm piecesScheme={pieceScheme} colorOnTop={4}/>
            </div>
            <div className={"algorithm-container"}>
                <OneAlgorithm piecesScheme={pieceScheme} colorOnTop={4}/>
            </div>
            <div className={"algorithm-container"}>
                <OneAlgorithm piecesScheme={pieceScheme} colorOnTop={4}/>
            </div>
            <div className={"algorithm-container"}>
                <OneAlgorithm piecesScheme={pieceScheme} colorOnTop={4}/>
            </div>
        </div>
    );
}



