import { Identifiable } from './identifiable';
import { Competition } from './competition';
import { Round } from './qualify/group';
import { StructureCell } from './structure/cell';
import { RoundNumber } from './round/number';

export class Category extends Identifiable {

    public static readonly DefaultName = 'standaard';
    protected structureCells: StructureCell[] = [];
    protected abbreviation: string|undefined;

    constructor(
        protected competition: Competition,
        protected name: string,
        private number: number) {
        super();

    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getAbbreviation(): string|undefined {
        return this.abbreviation;
    }

    setAbbreviation(abbreviation: string|undefined): void {
        this.abbreviation = abbreviation;
    }

    getNumber(): number {
        return this.number;
    }

    setNumber(number: number): void {
        this.number = number;
    }

    getStructureCells(): StructureCell[] {
        return this.structureCells;
    }

    getFirstStructureCell(): StructureCell {
        return this.getStructureCellByValue(1);
    }

    getStructureCell(roundNumber: RoundNumber): StructureCell {
        return this.getStructureCellByValue(roundNumber.getNumber());
    }

    protected getStructureCellByValue(roundNumber: number): StructureCell {
        const structureCell = this.getStructureCells().find((structureCell: StructureCell): boolean => {
            return structureCell.getRoundNumber().getNumber() === roundNumber;
        });
        if (structureCell === undefined) {
            throw new Error('de structuurcel kan niet gevonden worden');
        }
        return structureCell;
    }

    getRootRound(): Round {
        const structureCell = this.getStructureCellByValue(1);
        const rounds = structureCell.getRounds();
        if (rounds.length !== 1) {
            throw new Error('there must be 1 rootRound');

        }
        return rounds[0];
    }
}