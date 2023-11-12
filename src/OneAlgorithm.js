import {CubePiece} from "./CubePiece";

export function OneAlgorithm({piecesScheme, colorOnTop = 4, colorOnFront = 6}) {

    const colorForFace = {
        0: 0,
        1: colorOnTop,
        2: giveOppositeColor(colorOnTop),
        3: colorOnFront,
        4: giveOppositeColor(colorOnFront),
        5: giveOppositeColor(giveColorOnLeft(colorOnTop, colorOnFront)),
        6: giveColorOnLeft(colorOnTop, colorOnFront),
    };
    // 0 - grey color,
    // 1 - top face color
    // 2 - bottom face color
    // 3 - front face color
    // 4 - back face color
    // 5 - right face color
    // 6 - left face color

    function giveOppositeColor(color) {
        return (color + 2) % 6 + 1;
    }

    function giveColorOnLeft(topColor, frontColor) {
        const allowedColors = [1, 2, 3, 4, 5, 6];
        const step = topColor % 2 === 1 ? (1) : (-1);
        return (
            allowedColors[(frontColor - 1 + step) % 6] === topColor ||
            allowedColors[(frontColor - 1 + step) % 6] === giveOppositeColor(topColor) ?
            (allowedColors[(frontColor - 1 + step * 2) % 6]) : (allowedColors[(frontColor - 1 + step) % 6])
        );
    }

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
            <div className={"cube-row"}>
                <CubePiece sizeColorClass={"corner "} isVisible={false}/>
                <CubePiece sizeColorClass={"top-square " + colors[colorForFace[piecesScheme[0][1]]]}/>
                <CubePiece sizeColorClass={"top-square " + colors[colorForFace[piecesScheme[0][2]]]}/>
                <CubePiece sizeColorClass={"top-square " + colors[colorForFace[piecesScheme[0][3]]]}/>
                <CubePiece sizeColorClass={"corner "} isVisible={false}/>
            </div>
            <div className={"cube-row"}>
                <CubePiece sizeColorClass={"left-square " + colors[colorForFace[piecesScheme[1][0]]]}/>
                <CubePiece sizeColorClass={"front-square " + colors[colorForFace[piecesScheme[1][1]]]}/>
                <CubePiece sizeColorClass={"front-square " + colors[colorForFace[piecesScheme[1][2]]]}/>
                <CubePiece sizeColorClass={"front-square " + colors[colorForFace[piecesScheme[1][3]]]}/>
                <CubePiece sizeColorClass={"right-square " + colors[colorForFace[piecesScheme[1][4]]]}/>
            </div>
            <div className={"cube-row"}>
                <CubePiece sizeColorClass={"left-square " + colors[colorForFace[piecesScheme[2][0]]]}/>
                <CubePiece sizeColorClass={"front-square " + colors[colorForFace[piecesScheme[2][1]]]}/>
                <CubePiece sizeColorClass={"front-square " + colors[colorForFace[piecesScheme[2][2]]]}/>
                <CubePiece sizeColorClass={"front-square " + colors[colorForFace[piecesScheme[2][3]]]}/>
                <CubePiece sizeColorClass={"right-square " + colors[colorForFace[piecesScheme[2][4]]]}/>
            </div>
            <div className={"cube-row"}>
                <CubePiece sizeColorClass={"left-square " + colors[colorForFace[piecesScheme[3][0]]]}/>
                <CubePiece sizeColorClass={"front-square " + colors[colorForFace[piecesScheme[3][1]]]}/>
                <CubePiece sizeColorClass={"front-square " + colors[colorForFace[piecesScheme[3][2]]]}/>
                <CubePiece sizeColorClass={"front-square " + colors[colorForFace[piecesScheme[3][3]]]}/>
                <CubePiece sizeColorClass={"right-square " + colors[colorForFace[piecesScheme[3][4]]]}/>
            </div>
            <div className={"cube-row"}>
                <CubePiece sizeColorClass={"corner "} isVisible={false}/>
                <CubePiece sizeColorClass={"bottom-square " + colors[colorForFace[piecesScheme[4][1]]]}/>
                <CubePiece sizeColorClass={"bottom-square " + colors[colorForFace[piecesScheme[4][2]]]}/>
                <CubePiece sizeColorClass={"bottom-square " + colors[colorForFace[piecesScheme[4][3]]]}/>
                <CubePiece sizeColorClass={"corner "} isVisible={false}/>
            </div>
        </div>
    );
}