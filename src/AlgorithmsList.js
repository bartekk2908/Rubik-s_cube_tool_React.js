
import {Algorithm} from "./Algorithm";

export function AlgorithmsList({ colorOnTop = 1, colorOnFront = 5, algorithmsData, giveLearningStateFunc, learningStateDict }) {

    let algorithms = [];
    if (algorithmsData) {
        algorithms = algorithmsData.map((algorithmData, i) => {
            return (
                <div key={i}>
                    <Algorithm
                        algorithmData={algorithmData}
                        colorOnTop={colorOnTop}
                        colorOnFront={colorOnFront}
                        giveLearningStateFunc={giveLearningStateFunc}
                        learningStateValue={learningStateDict.get(i)}
                    />
                </div>
            );
        });
    }

    return (
        <div className={"algorithms-list"}>
            {algorithms}
        </div>
    );
}
