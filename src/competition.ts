import { Field } from './field';
import { League } from './league';
import { Referee } from './referee';
import { Season } from './season';
import { State } from './state';
import { SportConfig } from './sport/config';
import { Sport } from './sport';

export class Competition {
    protected id: string | number;
    protected league: League;
    protected season: Season;
    protected ruleSet: number;
    protected startDateTime: Date;
    protected state: number;
    protected referees: Referee[] = [];
    protected sportConfigs: SportConfig[] = [];

    constructor(league: League, season: Season) {
        this.setLeague(league);
        this.setSeason(season);
        this.setState(State.Created);
    }

    getId(): string | number {
        return this.id;
    }

    setId(id: string | number): void {
        this.id = id;
    }

    getLeague(): League {
        return this.league;
    }

    setLeague(league: League): void {
        this.league = league;
    }

    getSeason(): Season {
        return this.season;
    }

    setSeason(season: Season): void {
        this.season = season;
    }

    getRuleSet(): number {
        return this.ruleSet;
    }

    setRuleSet(ruleSet: number): void {
        this.ruleSet = ruleSet;
    }

    getStartDateTime(): Date {
        return this.startDateTime;
    }

    setStartDateTime(dateTime: Date): void {
        this.startDateTime = dateTime;
    }

    getState(): number {
        return this.state;
    }

    setState(state: number): void {
        this.state = state;
    }

    getName(): string {
        return this.getLeague().getName() + ' ' + this.getSeason().getName();
    }

    getFields(): Field[] {
        let fields = [];
        this.getSportConfigs().forEach(sportConfig => fields = fields.concat(sportConfig.getFields()));
        return fields;
    }

    getField(priority: number): Field {
        return this.getFields().find(field => field.getPriority() === priority);
    }

    getReferees(): Referee[] {
        return this.referees;
    }

    getReferee(priority: number): Referee {
        return this.referees.find(refereeIt => priority === refereeIt.getPriority());
    }

    removeReferee(referee: Referee) {
        const index = this.referees.indexOf(referee);
        if (index > -1) {
            const referees = this.referees.splice(index, 1);
            referees.shift();
            let priority = referee.getPriority();
            while (referees.length > 0) {
                const removedReferee = referees.shift();
                removedReferee.setPriority(priority++);
                this.referees.push(removedReferee);
            }
        }
    }

    getSports() {
        return this.sportConfigs.map(sportConfig => sportConfig.getSport());
    }

    getSportConfigs(): SportConfig[] {
        return this.sportConfigs;
    }

    getSportConfig(sport?: Sport): SportConfig {
        const sportConfig = this.sportConfigs.find(sportConfigIt => sportConfigIt.getSport() === sport);
        if (sportConfig !== undefined) {
            return sportConfig;
        }
        return this.getFirstSportConfig();
    }

    hasMultipleSportConfigs(): boolean {
        return this.sportConfigs.length > 1;
    }

    getFirstSportConfig(): SportConfig {
        return this.sportConfigs[0];
    }
}
