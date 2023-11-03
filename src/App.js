import {useState} from "react";
import './App.css';

import {Timer} from "./Timer";


export default function App() {
    const [appState, setAppState] = useState(0);
    // 0 - timer
    // 1 - training CFOP algorithms
    // 2 - analyzing CFOP solves

    return (
        <div className="Timer">
            <Timer holdingSpaceTime={500}/>
        </div>
    );
}
