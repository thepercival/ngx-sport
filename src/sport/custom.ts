
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
    static readonly Volleyball = 12;
    static readonly Baseball = 13;
    static readonly IceHockey = 14;
    static readonly Sjoelen = 15;
    // static readonly Shuffleboard = 16;

    static readonly Football_Line_GoalKepeer = 1;
    static readonly Football_Line_Defense = 2;
    static readonly Football_Line_Midfield = 4;
    static readonly Football_Line_Forward = 8;
    static readonly Football_Line_All = 15;

    static get(): number[] {
        return [
            SportCustom.Badminton,
            SportCustom.Basketball,
            SportCustom.Darts,
            SportCustom.ESports,
            SportCustom.Hockey,
            SportCustom.Baseball,
            SportCustom.Korfball,
            SportCustom.Chess,
            SportCustom.Squash,
            SportCustom.TableTennis,
            SportCustom.Tennis,
            SportCustom.Football,
            SportCustom.Volleyball,
            SportCustom.IceHockey,
            SportCustom.Sjoelen
        ];
    }
}
