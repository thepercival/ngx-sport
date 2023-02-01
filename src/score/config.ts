import { Round } from '../qualify/group';
import { Identifiable } from '../identifiable';
import { CompetitionSport } from '../competition/sport';
import { Sport } from '../sport';
import { ScoreDirection } from './direction';

export class ScoreConfig extends Identifiable {

    protected previous: ScoreConfig | undefined;
    protected direction: number = ScoreDirection.Upwards;
    protected maximum: number = 0;
    protected enabled: boolean = true;
    protected next: ScoreConfig | undefined;

    constructor(protected competitionSport: CompetitionSport, protected round: Round, previous?: ScoreConfig) {
        super();
        if (previous === undefined) {
            round.getScoreConfigs().push(this);
        } else {
            this.setPrevious(previous);
        }
    }

    getCompetitionSport(): CompetitionSport {
        return this.competitionSport;
    }

    getSport(): Sport {
        return this.competitionSport.getSport();
    }

    getRound(): Round {
        return this.round;
    }

    // moet direction opgenomen worden in constructor
    getDirection(): number {
        return this.direction;
    }

    setDirection(direction: number) {
        this.direction = direction;
    }

    getMaximum(): number {
        return this.maximum;
    }

    setMaximum(maximum: number) {
        this.maximum = maximum;
    }

    hasMaximum(): boolean {
        return this.maximum > 0;
    }

    getEnabled(): boolean {
        return this.enabled;
    }

    setEnabled(enabled: boolean) {
        this.enabled = enabled;
    }

    hasPrevious(): boolean {
        return this.previous !== undefined;
    }

    getPrevious(): ScoreConfig | undefined {
        return this.previous;
    }

    private setPrevious(previous: ScoreConfig) {
        this.previous = previous;
        if (this.previous !== undefined) {
            this.previous.setNext(this);
        }
    }

    getFirst(): ScoreConfig {
        const previous = this.getPrevious();
        return previous ? previous.getLast() : this;
    }

    isFirst(): boolean {
        return !this.hasPrevious();
    }

    getNext(): ScoreConfig | undefined {
        return this.next;
    }

    setNext(next: ScoreConfig) {
        this.next = next;
    }

    hasNext(): boolean {
        return this.next !== undefined;
    }

    getLast(): ScoreConfig {
        const next = this.getNext();
        return next ? next.getLast() : this;
    }

    isLast(): boolean {
        return !this.hasNext();
    }

    getCalculate(): ScoreConfig {
        const firstNext = this.getFirst().getNext();
        return firstNext?.getEnabled() ? firstNext : this;
    }

    useSubScore(): boolean {
        return (this !== this.getCalculate());
    }
}

