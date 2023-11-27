
export function PopupWindow({ trigger, children, closeFunc }) {

    return (
        trigger ? (
            <div className={"popup"}>
                <div className={"popup-inner"}>
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
