
export function ResultPopupWindow({ trigger, children }) {

    return (
        trigger ? (
            <div className={"result-popup"}>
                <div className={"result-popup-inner"}>
                    <button className={"close-button"}>close</button>
                    {children}
                </div>
            </div>
        ) : ""
    );
}
