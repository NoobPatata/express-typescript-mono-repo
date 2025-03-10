import bigDecimal from 'js-big-decimal';
import type { Decimal128 } from 'mongoose';

export class Arithmetic {
    private static toBigDecimal(value: number) {
        return new bigDecimal(value);
    }

    static negate(value: number): number {
        // If value passed in is 0 then return 0
        if (this.toBigDecimal(value).compareTo(new bigDecimal(0)) === 0) {
            return Number(this.toBigDecimal(value).getValue());
        }

        return Number(new bigDecimal(value).negate().getValue());
    }

    static add(...numbers: number[]): number {
        if (numbers.length < 2) {
            throw new Error('Addition require at least two numbers');
        }

        const result = numbers.reduce((sum, num) => {
            const operand = this.toBigDecimal(num);
            return sum.add(operand);
        }, new bigDecimal(0));

        return Number(result.getValue());
    }

    static subtract(...numbers: number[]): number {
        if (numbers.length < 2) {
            throw new Error('Subtraction requires at least two numbers.');
        }

        const initial = this.toBigDecimal(numbers[0] as number);
        const result = numbers.slice(1).reduce((difference, num) => {
            const operand = this.toBigDecimal(num);
            return difference.subtract(operand);
        }, initial);

        return Number(result.getValue());
    }

    static multiply(...numbers: number[]): number {
        if (numbers.length < 2) {
            throw new Error('Multiplication requires at least two numbers.');
        }

        const result = numbers.reduce((product, num) => {
            const operand = this.toBigDecimal(num);
            return product.multiply(operand);
        }, this.toBigDecimal(1));

        return Number(result.getValue());
    }

    static divide(number1: number, number2: number): number {
        const firstNumber = this.toBigDecimal(number1);
        let secondNumber = this.toBigDecimal(number2);

        if (secondNumber.compareTo(new bigDecimal(0)) === 0) {
            secondNumber = this.toBigDecimal(1);
        }

        return Number(firstNumber.divide(secondNumber).getValue());
    }

    static modulus(dividend: number, divisor: number): number {
        const dividendBigDecimal: bigDecimal = this.toBigDecimal(dividend);
        const divisorBigDecimal: bigDecimal = this.toBigDecimal(divisor);

        if (divisorBigDecimal.compareTo(new bigDecimal(0)) === 0) {
            throw new Error('Modulus by zero is not allowed.');
        }

        return Number(dividendBigDecimal.modulus(divisorBigDecimal).getValue());
    }

    static floor(value: number): number {
        return Number(this.toBigDecimal(value).floor().getValue());
    }

    static abs(value: number | Decimal128 | undefined | null): number {
        if (!value) {
            return 0;
        }

        return Number(this.toBigDecimal(Number(value)).abs().getValue());
    }

    static round(
        value: number,
        precision: number,
        roundingMode: Parameters<typeof bigDecimal.round>[2] = bigDecimal.RoundingModes.HALF_EVEN,
    ): number {
        return Number(Arithmetic.toBigDecimal(value).round(precision, roundingMode).getValue());
    }

    static noRoundDecimalPlaces(value: number | string, isStr: true, nDecimal?: number, toFixed?: boolean): string;

    static noRoundDecimalPlaces(value: number | string, isStr?: false, nDecimal?: number, toFixed?: boolean): number;

    static noRoundDecimalPlaces(value: number | string, isStr = false, nDecimal = 2, toFixed = false) {
        let numberToFormat = typeof value === 'string' ? Number(value) : value;
        if (toFixed) {
            numberToFormat = Arithmetic.round(numberToFormat, nDecimal, bigDecimal.RoundingModes.HALF_UP);
        }

        const splitString = numberToFormat.toString().split('.');
        const integerPart = splitString[0];
        let fractionalPart = splitString[1] ? splitString[1].substring(0, nDecimal) : '';

        // Ensure the fractional part has exactly nDecimal places
        if (fractionalPart.length < nDecimal) {
            fractionalPart = fractionalPart.padEnd(nDecimal, '0');
        }

        if (isStr) {
            return `${integerPart?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${fractionalPart}`;
        }

        const tempNum = `${integerPart}.${fractionalPart}`;
        let returnNum = 0;
        if (!Number.isNaN(Number.parseFloat(tempNum as string))) {
            returnNum = Number.parseFloat(tempNum as string);
        }

        return returnNum;
    }
}
