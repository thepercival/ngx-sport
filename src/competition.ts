import { Field } from './field';
import { League } from './league';
import { Referee } from './referee';
import { Season } from './season';
import { State } from './state';
import { SportConfig } from './sport/config';
import { Sport } from './sport';
import { RankingService } from './ranking/service';
import { Association } from './association';
import { TeamCompetitor } from './competitor/team';
import { TeamCompetitorMapper } from './competitor/team/mapper';

export class Competition {
    protected id: string | number = 0;
    protected ruleSet: number = RankingService.RULESSET_WC;
    protected state: number = State.Created;
    protected referees: Referee[] = [];
    protected sportConfigs: SportConfig[] = [];
    protected teamCompetitors: TeamCompetitor[] = [];

    constructor(protected league: League, protected season: Season, protected startDateTime: Date) {
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

    getAssociation(): Association {
        return this.getLeague().getAssociation();
    }

    getSeason(): Season {
        return this.season;
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
        let fields: Field[] = [];
        this.getSportConfigs().forEach(sportConfig => fields = fields.concat(sportConfig.getFields()));
        return fields;
    }

    getField(priority: number): Field | undefined {
        return this.getFields().find(field => field.getPriority() === priority);
    }

    getReferees(): Referee[] {
        return this.referees;
    }

    getReferee(priority: number): Referee | undefined {
        return this.referees.find(refereeIt => priority === refereeIt.getPriority());
    }

    removeReferee(referee: Referee) {
        const index = this.referees.indexOf(referee);
        if (index > -1) {
            const referees = this.referees.splice(index, 1);
            referees.shift();
            let priority = referee.getPriority();
            let removedReferee: Referee | undefined;
            while (removedReferee = referees.shift()) {
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

    getTeamCompetitors(): TeamCompetitor[] {
        return this.teamCompetitors;
    }
}
