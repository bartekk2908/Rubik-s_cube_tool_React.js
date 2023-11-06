
export function formatTime(time, fullMilliseconds) {
    const hours = Math.floor(time / 360_000);
    const minutes = Math.floor((time % 360_000) / 6_000);
    const seconds = Math.floor((time % 6_000) / 100);
    const milliseconds = Math.floor(time % 100);

    return (
        (hours ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.` :
            (minutes ? `${minutes}:${seconds.toString().padStart(2, '0')}.` :
                `${seconds}.`)
            + (fullMilliseconds ? milliseconds.toString().padStart(2, '0') : Math.floor(milliseconds/10)))
    );
}