import { PlaceLocation } from '../place/location';
import { Poule } from '../poule';
import { Round } from '../round';

export class QualifyReservationService {
    private reservations: PouleNumberReservations[] = [];

    constructor(childRound: Round) {
        childRound.getPoules().forEach(poule => {
            this.reservations.push({ toPouleNr: poule.getNumber(), fromPoules: [] });
        });
    }

    isFree(toPouleNumber: number, fromPoule: Poule): boolean {
        return !this.get(toPouleNumber).fromPoules.some(fromPouleIt => fromPouleIt === fromPoule);
    }

    reserve(toPouleNumber: number, fromPoule: Poule) {
        this.get(toPouleNumber).fromPoules.push(fromPoule);
    }

    protected get(toPouleNumber: number): PouleNumberReservations {
        return this.reservations.find(reservationIt => reservationIt.toPouleNr === toPouleNumber);
    }

    /**
     * 
     * @param toPouleNumber
     * @param fromRound
     * @param fromPlaceLocations
     */
    getFreeAndLeastAvailabe(toPouleNumber: number, fromRound: Round, fromPlaceLocations: PlaceLocation[]): PlaceLocation {
        let retPlaceLocation: PlaceLocation;
        let leastNrOfPoulesAvailable;
        fromPlaceLocations.forEach(fromPlaceLocation => {
            const fromPoule = fromRound.getPoule(fromPlaceLocation.getPouleNr());
            if (!this.isFree(toPouleNumber, fromPoule)) {
                return;
            }
            const nrOfPoulesAvailable = this.getNrOfPoulesAvailable(fromPoule, toPouleNumber + 1);
            if (leastNrOfPoulesAvailable === undefined || nrOfPoulesAvailable < leastNrOfPoulesAvailable) {
                retPlaceLocation = fromPlaceLocation;
                leastNrOfPoulesAvailable = nrOfPoulesAvailable;
            }
        });
        if (retPlaceLocation === undefined) {
            return fromPlaceLocations[0];
        }
        return retPlaceLocation;
    }

    protected getNrOfPoulesAvailable(fromPoule: Poule, toPouleNumber: number): number {
        return this.reservations.filter(reservation => reservation.toPouleNr >= toPouleNumber
            && this.isFree(reservation.toPouleNr, fromPoule)).length;
    }
}

interface PouleNumberReservations {
    toPouleNr: number;
    fromPoules: Poule[];
}
