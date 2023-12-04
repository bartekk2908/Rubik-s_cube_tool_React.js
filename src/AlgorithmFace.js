import {CubePiece} from "./CubePiece";
import {colorOfNumber, giveOppositeColor, giveColorOnLeft} from "./functions";

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

    return (
        <div className={"algorithm-face"}>
            <div className={"cube-row"}>
                <CubePiece sizeColorClass={"corner "} isVisible={false}/>
                <CubePiece sizeColorClass={"top-square " + colorOfNumber[colorForFace[piecesScheme[8]]]}/>
                <CubePiece sizeColorClass={"top-square " + colorOfNumber[colorForFace[piecesScheme[7]]]}/>
                <CubePiece sizeColorClass={"top-square " + colorOfNumber[colorForFace[piecesScheme[6]]]}/>
                <CubePiece sizeColorClass={"corner "} isVisible={false}/>
            </div>
            <div className={"cube-row"}>
                <CubePiece sizeColorClass={"left-square " + colorOfNumber[colorForFace[piecesScheme[9]]]}/>
                <CubePiece sizeColorClass={"front-square " + colorOfNumber[colorForFace[piecesScheme[12]]]}/>
                <CubePiece sizeColorClass={"front-square " + colorOfNumber[colorForFace[piecesScheme[13]]]}/>
                <CubePiece sizeColorClass={"front-square " + colorOfNumber[colorForFace[piecesScheme[14]]]}/>
                <CubePiece sizeColorClass={"right-square " + colorOfNumber[colorForFace[piecesScheme[5]]]}/>
            </div>
            <div className={"cube-row"}>
                <CubePiece sizeColorClass={"left-square " + colorOfNumber[colorForFace[piecesScheme[10]]]}/>
                <CubePiece sizeColorClass={"front-square " + colorOfNumber[colorForFace[piecesScheme[15]]]}/>
                <CubePiece sizeColorClass={"front-square " + colorOfNumber[colorForFace[piecesScheme[16]]]}/>
                <CubePiece sizeColorClass={"front-square " + colorOfNumber[colorForFace[piecesScheme[17]]]}/>
                <CubePiece sizeColorClass={"right-square " + colorOfNumber[colorForFace[piecesScheme[4]]]}/>
            </div>
            <div className={"cube-row"}>
                <CubePiece sizeColorClass={"left-square " + colorOfNumber[colorForFace[piecesScheme[11]]]}/>
                <CubePiece sizeColorClass={"front-square " + colorOfNumber[colorForFace[piecesScheme[18]]]}/>
                <CubePiece sizeColorClass={"front-square " + colorOfNumber[colorForFace[piecesScheme[19]]]}/>
                <CubePiece sizeColorClass={"front-square " + colorOfNumber[colorForFace[piecesScheme[20]]]}/>
                <CubePiece sizeColorClass={"right-square " + colorOfNumber[colorForFace[piecesScheme[3]]]}/>
            </div>
            <div className={"cube-row"}>
                <CubePiece sizeColorClass={"corner "} isVisible={false}/>
                <CubePiece sizeColorClass={"bottom-square " + colorOfNumber[colorForFace[piecesScheme[0]]]}/>
                <CubePiece sizeColorClass={"bottom-square " + colorOfNumber[colorForFace[piecesScheme[1]]]}/>
                <CubePiece sizeColorClass={"bottom-square " + colorOfNumber[colorForFace[piecesScheme[2]]]}/>
                <CubePiece sizeColorClass={"corner "} isVisible={false}/>
            </div>
        </div>
    );
}
