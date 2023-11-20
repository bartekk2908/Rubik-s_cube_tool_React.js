import Dexie from "dexie";

export const db = new Dexie('SpeedCubeTool');
db.version(1).stores({
    normal_solving_results: '++id, scramble, time, plusTwo, dnf',
    pll_oll_results: '++id, scramble, time, algorithmName, algorithmType, algorithmSequence',
});
