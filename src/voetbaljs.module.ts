import { NgModule } from '@angular/core';
import { Association } from './association';
import { Competition } from './competition';
import { Team } from './team';

@NgModule({
    imports: [],
    declarations: [Competition, Association, Team],
    exports: [Competition, Association, Team]
})
export class VoetbalModule { }
