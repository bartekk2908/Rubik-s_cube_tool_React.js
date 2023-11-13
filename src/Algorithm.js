import {AlgorithmFace} from "./AlgorithmFace";

export function Algorithm({algorithmData, colorOnTop, colorOnFront}) {
    const algorithmName = algorithmData[0];
    const algorithmString = algorithmData[1];
    const piecesScheme = algorithmData.slice();

    return (
        <div style={{display: "flex"}}>
            <AlgorithmFace piecesScheme={piecesScheme} colorOnTop={colorOnTop} colorOnFront={colorOnFront}/>
            <div style={{display: "block"}}>
                <div>
                    {algorithmString}
                </div>
                <div>
                    {algorithmName}
                </div>
            </div>
        </div>
    );
}