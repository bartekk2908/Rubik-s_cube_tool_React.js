import {CubePiece} from "./CubePiece";

export function OneAlgorithm({piecesScheme, colorOnTop = 4}) {

    const orientation = {
        1: {
            0: 0,
            1: 4,
            2: 5,
            3: 3,
            4: 1,
            5: 2,
            6: 6,
        },
        2: {
            0: 0,
            1: 5,
            2: 1,
            3: 3,
            4: 2,
            5: 4,
            6: 6,
        },
        3: {
            0: 0,
            1: 6,
            2: 2,
            3: 1,
            4: 3,
            5: 5,
            6: 4,
        },
        4: {
            0: 0,
            1: 1,
            2: 2,
            3: 3,
            4: 4,
            5: 5,
            6: 6,
        },
        5: {
            0: 0,
            1: 2,
            2: 4,
            3: 3,
            4: 5,
            5: 1,
            6: 6,
        },
        6: {
            0: 0,
            1: 3,
            2: 2,
            3: 4,
            4: 6,
            5: 5,
            6: 1,
        }
    };
    const colors = {
        0: "grey",
        1: "white",
        2: "orange",
        3: "blue",
        4: "yellow",
        5: "red",
        6: "green",
    }

    return (
        <div className={"algorithm"}>
            <div className={"row"}>
                <CubePiece sizeColorClass={"corner "} isVisible={false}/>
                <CubePiece sizeColorClass={"top-bottom-square " + colors[orientation[colorOnTop][piecesScheme[0][1]]]}/>
                <CubePiece sizeColorClass={"top-bottom-square " + colors[orientation[colorOnTop][piecesScheme[0][2]]]}/>
                <CubePiece sizeColorClass={"top-bottom-square " + colors[orientation[colorOnTop][piecesScheme[0][3]]]}/>
                <CubePiece sizeColorClass={"corner "} isVisible={false}/>
            </div>
            <div className={"row"}>
                <CubePiece sizeColorClass={"left-right-square " + colors[orientation[colorOnTop][piecesScheme[1][0]]]}/>
                <CubePiece sizeColorClass={"front-square " + colors[orientation[colorOnTop][piecesScheme[1][1]]]}/>
                <CubePiece sizeColorClass={"front-square " + colors[orientation[colorOnTop][piecesScheme[1][2]]]}/>
                <CubePiece sizeColorClass={"front-square " + colors[orientation[colorOnTop][piecesScheme[1][3]]]}/>
                <CubePiece sizeColorClass={"left-right-square " + colors[orientation[colorOnTop][piecesScheme[1][4]]]}/>
            </div>
            <div className={"row"}>
                <CubePiece sizeColorClass={"left-right-square " + colors[orientation[colorOnTop][piecesScheme[2][0]]]}/>
                <CubePiece sizeColorClass={"front-square " + colors[orientation[colorOnTop][piecesScheme[2][1]]]}/>
                <CubePiece sizeColorClass={"front-square " + colors[orientation[colorOnTop][piecesScheme[2][2]]]}/>
                <CubePiece sizeColorClass={"front-square " + colors[orientation[colorOnTop][piecesScheme[2][3]]]}/>
                <CubePiece sizeColorClass={"left-right-square " + colors[orientation[colorOnTop][piecesScheme[2][4]]]}/>
            </div>
            <div className={"row"}>
                <CubePiece sizeColorClass={"left-right-square " + colors[orientation[colorOnTop][piecesScheme[3][0]]]}/>
                <CubePiece sizeColorClass={"front-square " + colors[orientation[colorOnTop][piecesScheme[3][1]]]}/>
                <CubePiece sizeColorClass={"front-square " + colors[orientation[colorOnTop][piecesScheme[3][2]]]}/>
                <CubePiece sizeColorClass={"front-square " + colors[orientation[colorOnTop][piecesScheme[3][3]]]}/>
                <CubePiece sizeColorClass={"left-right-square " + colors[orientation[colorOnTop][piecesScheme[3][4]]]}/>
            </div>
            <div className={"row"}>
                <CubePiece sizeColorClass={"corner "} isVisible={false}/>
                <CubePiece sizeColorClass={"top-bottom-square " + colors[orientation[colorOnTop][piecesScheme[4][1]]]}/>
                <CubePiece sizeColorClass={"top-bottom-square " + colors[orientation[colorOnTop][piecesScheme[4][2]]]}/>
                <CubePiece sizeColorClass={"top-bottom-square " + colors[orientation[colorOnTop][piecesScheme[4][3]]]}/>
                <CubePiece sizeColorClass={"corner "} isVisible={false}/>
            </div>
        </div>
    );
}