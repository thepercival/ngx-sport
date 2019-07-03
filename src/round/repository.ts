import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { APIRepository } from '../api/repository';

@Injectable()
export class RoundRepository extends APIRepository {

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
