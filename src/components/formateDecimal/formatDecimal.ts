export const formatDecimal = (num: number | null, count: number) => {
    if (typeof num === "number") {
        if (num !== Math.floor(num)) {
            return num.toFixed(count)
        }
        return num;
    }
}