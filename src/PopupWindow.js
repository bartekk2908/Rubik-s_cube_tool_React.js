
export function PopupWindow({ trigger, children, closeFunc, height=360, width=640 }) {

    return (
        trigger ? (
            <div className={"popup"}>
                <div className={"popup-inner"} style={{height: `${height}px`, maxWidth: `${width}px`}}>
                    <button
                        className={"close-button custom-button orange-button"}
                        onClick={closeFunc}
                    >close</button>
                    {children}
                </div>
            </div>
        ) : ""
    );
}
