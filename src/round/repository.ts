import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { SportRepository } from '../repository';

/**
 * Created by coen on 3-3-17.
 */
@Injectable()
export class RoundRepository extends SportRepository {

    private url: string;

    constructor(
        router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'rounds';
    }
}
