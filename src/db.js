import Dexie from "dexie";

export const db = new Dexie('SpeedCubeTool');
db.version(1).stores({
    solving_results: '++id, scramble, time, plusTwoInspection, plusTwoTurn, dnf',
    pll_oll_training_results: '++id, scramble, time, algorithmName, algorithmType, algorithmSequence',
});

// db.delete();
