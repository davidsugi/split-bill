
export function customsRound(value: number, divider: number): number {
    const subdivider = (divider / 10);
    const firstDigits = Math.round(value % divider / subdivider);
    if (firstDigits <= 5) {
        return 0;
    }
    return 10 * subdivider;
}

export function roundCurrency(value: number): number {
    let digitsToRound = 100;
    let result = Math.floor(value / digitsToRound) * digitsToRound;
    while (digitsToRound > 1) {
        result += customsRound(value, digitsToRound);
        digitsToRound = digitsToRound / 10;
    }
    return result;
}
