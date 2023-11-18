import {useState} from "react";

import {Algorithm} from "./Algorithm";

export function AlgorithmsList({ colorOnTop = 1, colorOnFront = 5, algorithmsData }) {
    const [learningStateDict, setLearningStateDict] = useState(new Map());

    function giveLearningState(name, value) {
        learningStateDict.set(name, value);
    }

    let algorithms = [];
    if (algorithmsData) {
        algorithms = algorithmsData.map((algorithmData, i) => {
            return (
                <div key={i}>
                    <Algorithm
                        algorithmData={algorithmData}
                        colorOnTop={colorOnTop}
                        colorOnFront={colorOnFront}
                        giveLearningStateFunc={giveLearningState}
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
