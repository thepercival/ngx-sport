import { Poule } from '../poule';
import { Round } from '../round';
import { PoulePlace } from '../pouleplace';

export class QualifyReservationService {
    private reservations: PouleNumberReservations[] = [];

    constructor( private childRound: Round ) {
        childRound.getPoules().forEach( poule => {
            this.reservations.push( { toPouleNr: poule.getNumber(), fromPoules: [] } );
        });
    }

    isFree( toPouleNumber: number, fromPoule: Poule ): boolean {
        return !this.get(toPouleNumber).fromPoules.some( fromPouleIt => fromPouleIt === fromPoule);
    }

    reserve( toPouleNumber: number, fromPoule: Poule ) {
        this.get(toPouleNumber).fromPoules.push(fromPoule);        
    }

    reserveSingleRules() {
        this.childRound.getFromQualifyRules().filter( rule => !rule.isMultiple() ).forEach( rule => {
            rule.getToPoulePlaces().forEach( toPoulePlace => {
                const fromPoulePlace = rule.getFromEquivalent(toPoulePlace);
                if( this.isFree( toPoulePlace.getPoule().getNumber(), fromPoulePlace.getPoule() ) ) {
                    this.reserve( toPoulePlace.getPoule().getNumber(), fromPoulePlace.getPoule() );
                }
            });            
        });
    }

    protected get( toPouleNumber: number ): PouleNumberReservations {
        return this.reservations.find( reservationIt => reservationIt.toPouleNr === toPouleNumber );
    }

    /**
     * first free and than least times available
     * 
     * @param fromPoulePlaces 
     */
    getFreeAndLeastAvailabe( toPouleNumber: number, fromPoulePlaces: PoulePlace[] ): PoulePlace {
        let retPoulePlace;
        let leastNrOfPoulesAvailable;
        fromPoulePlaces.forEach( fromPoulePlace => {
            const fromPoule = fromPoulePlace.getPoule();
            if( this.isFree( toPouleNumber, fromPoule ) ) {
                const nrOfPoulesAvailable = this.getNrOfPoulesAvailable( fromPoule, toPouleNumber + 1);
                if( leastNrOfPoulesAvailable === undefined || nrOfPoulesAvailable < leastNrOfPoulesAvailable ) {
                    retPoulePlace = fromPoulePlace;
                    leastNrOfPoulesAvailable = nrOfPoulesAvailable;
                }
            }
            
        })
        return retPoulePlace;
    }

    protected getNrOfPoulesAvailable( fromPoule: Poule, toPouleNumber?: number): number {
        if( toPouleNumber === undefined ) {
            toPouleNumber = 1;
        }
        return this.reservations.filter( reservation => reservation.toPouleNr >= toPouleNumber
            && this.isFree( reservation.toPouleNr, fromPoule ) ).length;
    }
}

interface PouleNumberReservations {
    toPouleNr: number;
    fromPoules: Poule[];
}
