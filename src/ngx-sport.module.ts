import { NgModule } from '@angular/core';

import { Association } from './association';
import { Competition } from './competition';
import { CompetitionMapper } from './competition/mapper';
import { Competitor } from './competitor';
import { Field } from './field';
import { Game } from './game';
import { GamePlace } from './game/place';
import { GameScore } from './game/score';
import { League } from './league';
import { NameService } from './nameservice';
import { Place } from './place';
import { PlaceLocation } from './place/location';
import { PlanningConfig } from './planning/config';
import { PlanningConfigMapper } from './planning/config/mapper';
import { PlanningConfigService } from './planning/config/service';
import { Poule } from './poule';
import { HorizontalPoule } from './poule/horizontal';
import { QualifyGroup } from './qualify/group';
import { QualifyRuleMultiple } from './qualify/rule/multiple';
import { QualifyRuleSingle } from './qualify/rule/single';
import { QualifyService } from './qualify/service';
import { EndRankingService } from './ranking/end/service';
import { RankedRoundItem } from './ranking/item';
import { RankingService } from './ranking/service';
import { Referee } from './referee';
import { Round } from './round';
import { RoundNumber } from './round/number';
import { Season } from './season';
import { SportConfig } from './sport/config';
import { SportConfigMapper } from './sport/config/mapper';
import { SportConfigService } from './sport/config/service';
import { SportMapper } from './sport/mapper';
import { SportScoreConfig } from './sport/scoreconfig';
import { SportScoreConfigService } from './sport/scoreconfig/service';
import { SportService } from './sport/service';
import { Structure } from './structure';
import { StructureService } from './structure/service';

@NgModule({
    imports: [
        QualifyService, PlanningConfigService,
        SportMapper, StructureService, Structure,
        NameService, SportConfigMapper, PlanningConfigMapper
    ],
    exports: [
        Association, League, Competition, Field, Game, GameScore, GamePlace, HorizontalPoule,
        Poule, Place, PlaceLocation, QualifyGroup, RankingService, RankedRoundItem, EndRankingService, Referee,
        Round, RoundNumber, SportConfig, PlanningConfig, SportScoreConfig,
        Season, Competitor, QualifyRuleMultiple, QualifyRuleSingle,
        CompetitionMapper,
        QualifyService,
        PlanningConfigService,
        StructureService,
        SportMapper, SportConfigMapper,
        SportConfigService, SportScoreConfigService, SportService,
        NameService
    ]
})
export class SportModule { }
