
export function CubePiece({sizeColorClass, isVisible = true}) {

    return (
        <>
            <div className={(isVisible ? "" : "invisible-piece ") + "cube-piece " + sizeColorClass}/>
        </>
    );
}