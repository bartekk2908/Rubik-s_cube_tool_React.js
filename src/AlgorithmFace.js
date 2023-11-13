import {CubePiece} from "./CubePiece";

export function AlgorithmFace({piecesScheme, colorOnTop, colorOnFront}) {

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
        const step = topColor % 2 === 1 ? (1) : (5);
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
        <div className={"algorithm-face"}>
            <div className={"cube-row"}>
                <CubePiece sizeColorClass={"corner "} isVisible={false}/>
                <CubePiece sizeColorClass={"top-square " + colors[colorForFace[piecesScheme[10]]]}/>
                <CubePiece sizeColorClass={"top-square " + colors[colorForFace[piecesScheme[9]]]}/>
                <CubePiece sizeColorClass={"top-square " + colors[colorForFace[piecesScheme[8]]]}/>
                <CubePiece sizeColorClass={"corner "} isVisible={false}/>
            </div>
            <div className={"cube-row"}>
                <CubePiece sizeColorClass={"left-square " + colors[colorForFace[piecesScheme[11]]]}/>
                <CubePiece sizeColorClass={"front-square " + colors[colorForFace[piecesScheme[14]]]}/>
                <CubePiece sizeColorClass={"front-square " + colors[colorForFace[piecesScheme[15]]]}/>
                <CubePiece sizeColorClass={"front-square " + colors[colorForFace[piecesScheme[16]]]}/>
                <CubePiece sizeColorClass={"right-square " + colors[colorForFace[piecesScheme[7]]]}/>
            </div>
            <div className={"cube-row"}>
                <CubePiece sizeColorClass={"left-square " + colors[colorForFace[piecesScheme[12]]]}/>
                <CubePiece sizeColorClass={"front-square " + colors[colorForFace[piecesScheme[17]]]}/>
                <CubePiece sizeColorClass={"front-square " + colors[colorForFace[piecesScheme[18]]]}/>
                <CubePiece sizeColorClass={"front-square " + colors[colorForFace[piecesScheme[19]]]}/>
                <CubePiece sizeColorClass={"right-square " + colors[colorForFace[piecesScheme[6]]]}/>
            </div>
            <div className={"cube-row"}>
                <CubePiece sizeColorClass={"left-square " + colors[colorForFace[piecesScheme[13]]]}/>
                <CubePiece sizeColorClass={"front-square " + colors[colorForFace[piecesScheme[20]]]}/>
                <CubePiece sizeColorClass={"front-square " + colors[colorForFace[piecesScheme[21]]]}/>
                <CubePiece sizeColorClass={"front-square " + colors[colorForFace[piecesScheme[22]]]}/>
                <CubePiece sizeColorClass={"right-square " + colors[colorForFace[piecesScheme[5]]]}/>
            </div>
            <div className={"cube-row"}>
                <CubePiece sizeColorClass={"corner "} isVisible={false}/>
                <CubePiece sizeColorClass={"bottom-square " + colors[colorForFace[piecesScheme[2]]]}/>
                <CubePiece sizeColorClass={"bottom-square " + colors[colorForFace[piecesScheme[3]]]}/>
                <CubePiece sizeColorClass={"bottom-square " + colors[colorForFace[piecesScheme[4]]]}/>
                <CubePiece sizeColorClass={"corner "} isVisible={false}/>
            </div>
        </div>
    );
}