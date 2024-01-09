

export function kelvinToCelsius(tempKelvin){
    return tempKelvin - 273.15;
}

export function speedKmh(tempSpeed){
    return tempSpeed * 3.6;
}

export function gustKmh(tempGust){
    return tempGust * 3.6;
}

export function getDayOfWeek(){
    const today = new Date();
    return today.getDay();
}