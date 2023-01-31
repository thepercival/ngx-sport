export class SportMath {
    public above(top: number, bottom: number): number
    {
        const y = this.faculty(top);
        const z = (this.faculty(top - bottom) * this.faculty(bottom));
        return y / z;
    }

    public faculty(x: number): number
    {
        if (x > 1) {
            return this.faculty(x - 1) * x;
        }
        return 1;
    }
}