
export abstract class SportCustom {
    static readonly Badminton = 1;
    static readonly Basketball = 2;
    static readonly Darts = 3;
    static readonly ESports = 4;
    static readonly Hockey = 5;
    static readonly Korfball = 6;
    static readonly Chess = 7;
    static readonly Squash = 8;
    static readonly TableTennis = 9;
    static readonly Tennis = 10;
    static readonly Football = 11;
    static readonly Voleyball = 12;
    static readonly Baseball = 13;

    static get(): number[] {
        return [
            SportCustom.Badminton,
            SportCustom.Basketball,
            SportCustom.Darts,
            SportCustom.ESports,
            SportCustom.Hockey,
            SportCustom.Korfball,
            SportCustom.Chess,
            SportCustom.Squash,
            SportCustom.TableTennis,
            SportCustom.Tennis,
            SportCustom.Football,
            SportCustom.Voleyball,
            SportCustom.Baseball
        ];
    }
}
