import { VoetbalRange } from '../../range';
import { Sport } from '../../sport';
import { StructureService } from '../../structure/service';

export class PlanningConfigOptimalization {
    protected currentNrOfBatchGames: VoetbalRange;
    protected maxNrOfGamesInARow = {};

    constructor(
        protected nrOfFields: number,
        protected selfReferee: boolean,
        protected nrOfReferees: number,
        protected nrOfPoules: number,
        protected nrOfPlaces: number,
        protected teamup: boolean
    ) {
        const maxNrOfGamesPerBatch = this.getInitialMaxNrOfBatchGames();
        this.currentNrOfBatchGames = { min: maxNrOfGamesPerBatch, max: maxNrOfGamesPerBatch };
        this.maxNrOfGamesInARow[this.getId(this.currentNrOfBatchGames)] = this.getInitialMaxNrOfGamesInARow(this.currentNrOfBatchGames.max);
    }

    public getMaxNrOfGamesPerBatch(): VoetbalRange {
        return this.currentNrOfBatchGames;
    }

    public decreaseNrOfBatchGames(): VoetbalRange {
        this.currentNrOfBatchGames.min--;
        if (this.maxNrOfGamesInARow[this.getId(this.currentNrOfBatchGames)] === undefined) {
            this.maxNrOfGamesInARow[this.getId(this.currentNrOfBatchGames)] =
                this.getInitialMaxNrOfGamesInARow(this.currentNrOfBatchGames.max);
        }
        return this.currentNrOfBatchGames;
    }

    protected getId(nrOfBatchGames: VoetbalRange): string {
        return nrOfBatchGames.min + '-' + nrOfBatchGames.max;
    }

    public getMaxNrOfGamesInARow(): number {
        return this.maxNrOfGamesInARow[this.getId(this.currentNrOfBatchGames)];
    }

    public setMaxNrOfGamesInARow(maxNrOfGamesInARow: number): number {
        this.maxNrOfGamesInARow[this.getId(this.currentNrOfBatchGames)] = maxNrOfGamesInARow;
        return this.maxNrOfGamesInARow[this.getId(this.currentNrOfBatchGames)];
    }

    protected getInitialMaxNrOfBatchGames(): number {
        // maxNrOfGamesPerBatch = count(this->fields);
        let maxNrOfGamesPerBatch = this.nrOfFields;

        //        if (!this->planningConfig->getSelfReferee() && count(this->referees) > 0
        // && count(thisreferees) < maxNrOfGamesPerBatch) {
        //            maxNrOfGamesPerBatch = count(this->referees );
        //        }

        if (!this.selfReferee && this.nrOfReferees > 0 && this.nrOfReferees < maxNrOfGamesPerBatch) {
            maxNrOfGamesPerBatch = this.nrOfReferees;
        }

        const nrOfGamePlaces = this.getNrOfGamePlaces(this.selfReferee, this.teamup);
        const nrOfRoundNumberPlaces = this.nrOfPlaces;
        const nrOfGamesSimultaneously = Math.floor(nrOfRoundNumberPlaces / nrOfGamePlaces);
        // const maxNrOfGamesPerBatchPreBorder = this.maxNrOfGamesPerBatch;
        if (nrOfGamesSimultaneously < maxNrOfGamesPerBatch) {
            maxNrOfGamesPerBatch = nrOfGamesSimultaneously;
        }
        return maxNrOfGamesPerBatch;
        // TEMPCOMMENT
        // const ss = new StructureService();
        // const nrOfPoulePlaces = ss.getNrOfPlacesPerPoule(this.roundNumber.getNrOfPlaces(), this.roundNumber.getPoules().length);
        // if ((nrOfPoulePlaces - 1) === this.nrOfSports
        //     && this.nrOfSports > 1 && this.nrOfSports === this.fields.length
        // ) {
        //     if (this.roundNumber.getValidPlanningConfig().getNrOfHeadtohead() === 2 ||
        //         this.roundNumber.getValidPlanningConfig().getNrOfHeadtohead() === 3) {
        //         this.maxNrOfGamesPerBatch = 2;
        //     } else {
        //         this.maxNrOfGamesPerBatch = 1; // this.roundNumber.getPoules().length;
        //     }
        // }

        // const nrOfPlacesPerBatch = nrOfGamePlaces * this.maxNrOfGamesPerBatch;
        // if (this.nrOfSports > 1) {
        //     /*if (this.roundNumber.getNrOfPlaces() === nrOfPlacesPerBatch) {
        //         this.maxNrOfGamesPerBatch--;
        //     } else*/ if (Math.floor(this.roundNumber.getNrOfPlaces() / nrOfPlacesPerBatch) < 2) {
        //         const sportPlanningConfigService = new SportPlanningConfigService();
        //         const defaultNrOfGames = sportPlanningConfigService.getNrOfCombinationsExt(this.roundNumber);
        //         const nrOfHeadtothead = nrOfGames / defaultNrOfGames;
        //         // if (((nrOfPlacesPerBatch * nrOfHeadtothead) % this.roundNumber.getNrOfPlaces()) !== 0) {

        //         if (maxNrOfGamesPerBatchPreBorder >= this.maxNrOfGamesPerBatch) {



        //             if ((nrOfHeadtothead % 2) === 1) {
        //                 const comp = this.roundNumber.getCompetition();
        //                 if (
        //                     (this.roundNumber.getNrOfPlaces() - 1) > comp.getSports().length
        //                     /*|| ((this.roundNumber.getNrOfPlaces() - 1) === comp.getSports().length
        //                         && comp.getFields().length > comp.getSports().length)*/
        //                 ) {
        //                     this.maxNrOfGamesPerBatch--;
        //                 }
        //                 // this.maxNrOfGamesPerBatch--;

        //             } /*else if (this.nrOfSports === (nrOfPoulePlaces - 1)) {
        //                 this.maxNrOfGamesPerBatch--;
        //             }*/

        //             // if ((nrOfHeadtothead * maxNrOfGamesPerBatchPreBorder) <= this.maxNrOfGamesPerBatch) {
        //             //     this.maxNrOfGamesPerBatch--;
        //             // }

        //             /*if (maxNrOfGamesPerBatchPreBorder === this.maxNrOfGamesPerBatch
        //                 && ((nrOfHeadtothead * maxNrOfGamesPerBatchPreBorder) === this.maxNrOfGamesPerBatch)) {
        //                 this.maxNrOfGamesPerBatch--;
        //             } else if (maxNrOfGamesPerBatchPreBorder > this.maxNrOfGamesPerBatch
        //                 && ((nrOfHeadtothead * maxNrOfGamesPerBatchPreBorder) < this.maxNrOfGamesPerBatch)) {
        //                 this.maxNrOfGamesPerBatch--;
        //             } /*else {
        //                 this.tryShuffledFields = true;
        //             }*/
        //             // nrOfPlacesPerBatch deelbaar door nrOfGames
        //             // als wat is verschil met:
        //             // 3v en 4d 1H2H
        //             // 3v en 4d 2H2H deze niet heeft 12G
        //             // 2v en 4d
        //         }
        //     }


        //     // this.maxNrOfGamesPerBatch moet 1 zijn, maar er kunnen twee, dus bij meerdere sporten
        //     // en totaal aantal deelnemers <= aantal deelnemers per batch
        //     //      bij  2v  4d dan 4 <= 4 1H2H van 2 naar 1
        //     //      bij 21v 44d dan 8 <= 8 1H2H van 3 naar 2
        //     //      bij  3v  4d dan 4 <= 6 1H2H van 2 naar 1
        //     //      bij  3v  4d dan 4 <= 6 2H2H van 2 naar 1(FOUT)

        //     // if (this.fields.length === 3 && this.nrOfSports === 2) {
        //     //     this.tryShuffledFields = true;
        //     // }
        // }
        // if (this.maxNrOfGamesPerBatch < 1) {
        //     this.maxNrOfGamesPerBatch = 1;
        // }
    }

    protected getInitialMaxNrOfGamesInARow(maxNrOfBatchGames: number) {
        const nrOfGamePlaces = this.getNrOfGamePlaces(this.selfReferee, this.teamup);

        // @TODO only when all games(field->sports) have equal nrOfPlacesPerGame
        const nrOfPlacesPerBatch = nrOfGamePlaces * maxNrOfBatchGames;

        const nrOfRestPerBatch = this.nrOfPlaces - nrOfPlacesPerBatch;
        if (nrOfRestPerBatch < 1) {
            return -1;
        }

        let maxNrOfGamesInARow = Math.ceil(this.nrOfPlaces / nrOfRestPerBatch) - 1;
        // 12 places per batch 16 places
        // if (nrOfPlacesPerBatch === nrOfRestPerBatch && this.nrOfPoules === 1) {
        //     maxNrOfGamesInARow++;
        // }

        const structureService = new StructureService();
        const nrOfPoulePlaces = structureService.getNrOfPlacesPerPoule(this.nrOfPlaces, this.nrOfPoules);
        if (maxNrOfGamesInARow > (nrOfPoulePlaces - 1)) {
            maxNrOfGamesInARow = (nrOfPoulePlaces - 1);

            //            kun je ook altijd berekenen voor headtohead = 1? wanneer je meerdere sporten hebt dan kan het niet
            //            omdat je soms niet alle sporten binnen 1 h2h kan doen
            //            dan zou je moeten zeggen dat alle sporten binnen 1 h2h afgewerkt moeten kunnen worden
            //            dus bij 3 sporten heb je dan minimaal 4 deelnemers per poule nodig
            //            heb je acht sporten dan heb je dus minimaal een poule van 9 nodig,
            //
            //            je zou dan wel alle velden moeten gebruiken
            //            omdat je niet weet welke sport op welk veld gespeeld wordt, dan krijg je dus een andere planning!!

            //            je zou dan ervoor kunnen kiezen om 2 poules van 5 te doen en dan iedereen 2x tegen elkaar
            //            je pakt dan gewoon


            //         const sportPlanningConfigService = new SportPlanningConfigService();
            //         const defaultNrOfGames = sportPlanningConfigService.getNrOfCombinationsExt(this.roundNumber);
            //         const nrOfHeadtothead = nrOfGames / defaultNrOfGames;
            //            nrOfHeadtohead = 2;
            //            if( nrOfHeadtohead > 1 ) {
            //                maxNrOfGamesInARow *= 2;
            //            }
        }
        // maxNrOfGamesInARow = -1;
        // if (maxNrOfGamesInARow === 4) {
        //     maxNrOfGamesInARow = 5;
        // }

        if (this.nrOfPlaces === 8) {
            if (nrOfPlacesPerBatch >= nrOfRestPerBatch && (nrOfPlacesPerBatch % nrOfRestPerBatch) === 0 && this.nrOfPoules === 1
                && (this.nrOfFields % 2) === 1
            ) {
                maxNrOfGamesInARow++;
            }
        }

        // if (this.nrOfPlaces > 8 && (this.nrOfPlaces % 2) === 1) {
        //     if ((nrOfPlacesPerBatch + 1) > nrOfRestPerBatch && this.nrOfPoules === 1
        //     ) {
        //         maxNrOfGamesInARow++;
        //     }
        // }


        return maxNrOfGamesInARow;
    }

    //            if (this->nrOfSports > 1) {
    //                if ((nrOfPlaces - 1) === nrOfPlacesPerBatch) {
    //                    this->maxNrOfGamesInARow++;
    //                }
    //            }

    // nrOfPlacesPerBatch = 2
    // nrOfRestPerBatch = 1
    // nrOfPlaces = 3

    // bij 3 teams en 2 teams per batch speelt ook aantal placesper
    // if (nrOfPlacesPerBatch === nrOfRestPerBatch) {
    //     this.maxNrOfGamesInARow++;
    // }
    // if (this.nrOfSports >= Math.ceil(nrOfRestPerBatch / this.fields.length)
    //     && this.nrOfSports > 1 /*&& this.nrOfSports === this.fields.length*/) {
    //     // this.maxNrOfGamesInARow++;
    //     this.maxNrOfGamesInARow++;
    //     // this.maxNrOfGamesInARow = -1;
    // }
    // }
    // if (this.nrOfSports > 1) {
    //     this.maxNrOfGamesInARow = -1;
    // }
    // this.maxNrOfGamesInARow = -1;

    protected getNrOfGamePlaces(selfReferee: boolean, teamup: boolean): number {
        let nrOfGamePlaces = Sport.TEMPDEFAULT;
        if (teamup) {
            nrOfGamePlaces *= 2;
        }
        //        if (this->planningConfig->getTeamup()) {
        //            nrOfGamePlaces *= 2;
        //        }
        //        if (this->planningConfig->getSelfReferee()) {
        //            nrOfGamePlaces++;
        //        }
        if (selfReferee) {
            nrOfGamePlaces++;
        }
        return nrOfGamePlaces;
    }
}
