import Dexie from "dexie";

export const db = new Dexie('SpeedCubeTool');
db.version(1).stores({
    normal_solving_results: '++id, scramble, time, plus_two, dnf',
    pll_oll_results: '++id, scramble, time, algorithm_name, algorithm_type, algorithm_sequence',
});
