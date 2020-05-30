import { Injectable } from '@nestjs/common';
import * as rot47 from 'rot47';
import { Config } from 'src/config';
import { DbLogs } from 'src/db.logs';

@Injectable()
export class DBAccess {
  private oglasSearchByString: string;
  private oglasSelectAll: string;
  private oglasSearchByManufSerieModel:string;

  constructor(private config:Config, private dbLogs: DbLogs) {
    this.oglasSearchByString = "D6=64E FG]#68:DEC:C2?s2}6[ 49]>2<6*62C[ F]FD6C?2>6[ >=]6?5~7!C@5F4E:@?*62C[ >=]>@56=}2>6[ D]D6C:6D}2>6[ >]>2?F724EFC6C}2>6[ 3]q@5J}2>6[ @]@8=2D}2K:G[ @]@8=2DrC62E65pE[ @]@8=2D~A:D[ @]G:6HD[ @]C2E:?8[ 8E]82D%JA6 7C@> @8=2D @ =67E ;@:? FD6C0G69:4=6 FG @? @]G69:4=6!<&D6C'69:4=6 l FG]!<&D6C'69:4=6 =67E ;@:? A9@E@ A @? A]@8=2D!<~8=2D l @]!<~8=2D =67E ;@:? 492DD:D 49 @? 49]!<r92DD:D l FG]492DD:D!<r92DD:D =67E ;@:? FD6C F @? F]FD6Cx5 l FG]!<&D6C'69:4=6 =67E ;@:? >@56= >= @? >=]!<|@56= l 49]>@56=!<|@56= =67E ;@:? D6C:6D D @? D]!<$6C:6D l >=]D6C:6D!<$6C:6D =67E ;@:? >2?F724EFC6C > @? >]!<|2?F724EFC6C l D]>2?F724EFC6C!<|2?F724EFC6C =67E ;@:? 82D0EJA6 8E @? 8E]!<v2D%JA6 l >=]82D%JA6!<v2D%JA6 =67E ;@:? 3@5J 3 @? 3]!<q@5J l >=]3@5J!<q@5J H96C6 |p%rw WD]D6C:6D}2>6X pvpx}$% Wn x} q~~{tp} |~stX @C |p%rw W>]>2?F724EFC6C}2>6X pvpx}$% Wn x} q~~{tp} |~stX @C |p%rw W>=]>@56=}2>6X pvpx}$% Wn x} q~~{tp} |~stX @C56C 3J |p%rw WD]D6C:6D}2>6X pvpx}$% Wn x} q~~{tp} |~stX Z |p%rw W>]>2?F724EFC6C}2>6X pvpx}$% Wn x} q~~{tp} |~stX Z |p%rw W>=]>@56=}2>6X pvpx}$% Wn x} q~~{tp} |~stX 56D4j"; 
    this.oglasSelectAll = "D6=64E FG]#68:DEC:C2?s2}6[ 49]>2<6*62C[ F]FD6C?2>6[ >=]6?5~7!C@5F4E:@?*62C[ >=]>@56=}2>6[ D]D6C:6D}2>6[ >]>2?F724EFC6C}2>6[ 3]q@5J}2>6[ @]@8=2D}2K:G[ @]@8=2DrC62E65pE[ @]@8=2D~A:D[ @]G:6HD[ @]C2E:?8[ 8E]82D%JA6 7C@> @8=2D @ =67E ;@:? FD6C0G69:4=6 FG @? @]G69:4=6!<&D6C'69:4=6 l FG]!<&D6C'69:4=6 =67E ;@:? A9@E@ A @? A]@8=2D!<~8=2D l @]!<~8=2D =67E ;@:? 492DD:D 49 @? 49]!<r92DD:D l FG]492DD:D!<r92DD:D =67E ;@:? FD6C F @? F]FD6Cx5 l FG]!<&D6C'69:4=6 =67E ;@:? >@56= >= @? >=]!<|@56= l 49]>@56=!<|@56= =67E ;@:? D6C:6D D @? D]!<$6C:6D l >=]D6C:6D!<$6C:6D =67E ;@:? >2?F724EFC6C > @? >]!<|2?F724EFC6C l D]>2?F724EFC6C!<|2?F724EFC6C =67E ;@:? 82D0EJA6 8E @? 8E]!<v2D%JA6 l >=]82D%JA6!<v2D%JA6 =67E ;@:? 3@5J 3 @? 3]!<q@5J l >=]3@5J!<q@5Jj";
    this.oglasSearchByManufSerieModel = "D6=64E FG]#68:DEC:C2?s2}6[ 49]>2<6*62C[ F]FD6C?2>6[ >=]6?5~7!C@5F4E:@?*62C[ >=]>@56=}2>6[ D]D6C:6D}2>6[ >]>2?F724EFC6C}2>6[ 3]q@5J}2>6[ @]@8=2D}2K:G[ @]@8=2DrC62E65pE[ @]@8=2D~A:D[ @]G:6HD[ @]C2E:?8[ 8E]82D%JA6 7C@> @8=2D @ =67E ;@:? FD6C0G69:4=6 FG @? @]G69:4=6!<&D6C'69:4=6 l FG]!<&D6C'69:4=6 =67E ;@:? A9@E@ A @? A]@8=2D!<~8=2D l @]!<~8=2D =67E ;@:? 492DD:D 49 @? 49]!<r92DD:D l FG]492DD:D!<r92DD:D =67E ;@:? FD6C F @? F]FD6Cx5 l FG]!<&D6C'69:4=6 =67E ;@:? >@56= >= @? >=]!<|@56= l 49]>@56=!<|@56= =67E ;@:? D6C:6D D @? D]!<$6C:6D l >=]D6C:6D!<$6C:6D =67E ;@:? >2?F724EFC6C > @? >]!<|2?F724EFC6C l D]>2?F724EFC6C!<|2?F724EFC6C =67E ;@:? 82D0EJA6 8E @? 8E]!<v2D%JA6 l >=]82D%JA6!<v2D%JA6 =67E ;@:? 3@5J 3 @? 3]!<q@5J l >=]3@5J!<q@5J H96C6 Wn :D ?F== @C >]!<|2?F724EFC6C l nX 2?5 Wn :D ?F== @C D]!<$6C:6D l nX 2?5 Wn :D ?F== @C >=]!<|@56= l nXj ";
  }
  private passToLogger(query:string) {
    if(this.config.dbAccessQueryLogs) {
      this.dbLogs.queryLog(rot47(query));
    }
  }
/**
 * @param 3x search
 * @type string[]
 */
  getOglasSearchByString():string {
    this.passToLogger(this.oglasSearchByString);
    return rot47(this.oglasSearchByString);
  }

  getOglasAll():string {
    this.passToLogger(this.oglasSelectAll);
    return rot47(this.oglasSelectAll);
  }

  /**
   * @param 2x PkManufacturer or 2x null, 2x PkSeries or 2x null, 2x PkModel or null
   */
  getOglasByManufSerieModel() {
    this.passToLogger(this.oglasSearchByManufSerieModel);
    return rot47(this.oglasSearchByManufSerieModel);
  }
}
