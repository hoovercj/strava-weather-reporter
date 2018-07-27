import { format } from 'date-fns';

import { DisplayUnits } from 'src/services/strava/strava';

export const dateToDateTimeString = (date: Date): string => {
    return format(date, 'MMMM Do[,] YYYY [at] h[:]mm a')
}

export const metersPerSecondToDisplayString = (metersPerSecond: number, displayUnits: DisplayUnits): string => {
    switch (displayUnits) {
        case DisplayUnits.Kilometers:
            return metersPerSecondToMinutesPerKilometerString(metersPerSecond);
        case DisplayUnits.Miles:
        default:
            return metersPerSecondToMinutesPerMileString(metersPerSecond);
    }
}

export const distanceInMetersToDisplayString = (distanceInMeters: number, displayUnits: DisplayUnits): string => {
    switch (displayUnits) {
        case DisplayUnits.Kilometers:
            return distanceInMetersToKmString(distanceInMeters);
            case DisplayUnits.Miles:
            default:
            return distanceInMetersToMileString(distanceInMeters);
    }
}

export const durationInSecondsToString = (duration: number): string => {
    const secondsPerHour = 60 * 60;
    const secondsPerMinute = 60;

    const timeParts = [];

    const hours = Math.floor(duration / secondsPerHour)
    duration -= hours * secondsPerHour;
    if (hours) {
        timeParts.push(hours);
    }

    const minutes = Math.floor(duration / secondsPerMinute);
    duration -= minutes * secondsPerMinute;
    timeParts.push(leftPad(minutes, 2));

    const seconds = duration;
    timeParts.push(leftPad(seconds, 2));

    return timeParts.join(':');
}

const getRoundedString = (value: number | string, decimals: number): string => {
    return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals).toFixed(decimals);
}

const leftPad = (num: number, size: number): string => {
    let s = String(num);
    while (s.length < size) { s = "0" + s };
    return s;
}

const distanceInMetersToKmString = (meters: number): string => {
    const kilometers = meters / 1000
    return `${getRoundedString(kilometers, 2)} km`;
}

const distanceInMetersToMileString = (meters: number): string => {
    const miles = meters*0.000621371192;
    return `${getRoundedString(miles, 2)} mi`;
}

const metersPerSecondToMinutesPerKilometerString = (metersPerSecond: number): string => {
    const minutesPerKilometerDecimal = metersPerSecond * 1.66666667;
    const minutes = Math.floor(minutesPerKilometerDecimal);
    const seconds = leftPad(Math.round((minutesPerKilometerDecimal % 1) * 60), 2);

    return `${minutes}:${seconds} / km`;
}

const metersPerSecondToMinutesPerMileString = (metersPerSecond: number): string => {
    const minutesPerMileDecimal = metersPerSecond * 2.68224;
    const minutes = Math.floor(minutesPerMileDecimal);
    const seconds = leftPad(Math.round((minutesPerMileDecimal % 1) * 60), 2);

    return `${minutes}:${seconds} / mi`;
}
