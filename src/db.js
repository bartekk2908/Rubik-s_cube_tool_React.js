import Dexie from "dexie";

export const db = new Dexie('SpeedCubeTool');
db.version(1).stores({
    times: '++id, scramble, time, plus_two, dnf',
});
