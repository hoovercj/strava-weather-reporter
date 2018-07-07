export const getRoundedString = (value: number | string, decimals: number): string => {
    return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals).toFixed(decimals);
}

export const leftPad = (num: number, size: number): string => {
    let s = String(num);
    while (s.length < size) { s = "0" + s };
    return s;
}

export const distanceInMetersToMileString = (meters: number): string => {
    const miles = meters*0.000621371192;
    return `${getRoundedString(miles, 2)} mi`;
}

export const metersPerSecondToMinutesPerMileString = (metersPerSecond: number): string => {
    const minutesPerMileDecimal = metersPerSecond * 26.8224;
    const minutes = Math.trunc(minutesPerMileDecimal);
    const seconds = Math.round((minutesPerMileDecimal % 1) * 60);

    return `${minutes}:${seconds} / mi`;
}

export const durationInSecondsToString = (duration: number): string => {
    const secondsPerHour = 60 * 60;
    const secondsPerMinute = 60;

    const timeParts = [];

    const hours = Math.trunc(duration / secondsPerHour)
    duration -= hours * secondsPerHour;
    if (hours) {
        timeParts.push(hours);
    }

    const minutes = Math.trunc(duration / secondsPerMinute);
    duration -= minutes * secondsPerMinute;
    timeParts.push(leftPad(minutes, 2));

    const seconds = duration;
    timeParts.push(leftPad(seconds, 2));

    return timeParts.join(':');
}