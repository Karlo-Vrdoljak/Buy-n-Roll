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
    this.oglasSearchByString = "D6=64E FG]#68:DEC:C2?s2}6[ 49]>2<6*62C[ 49]G69:4=6$E2E6[ 49]<:=@>6E6CD[ 4]4@=@C[ 4]4@=@Cr@56[ >=]6?5~7!C@5F4E:@?*62C[ >=]>@56=}2>6[ D]D6C:6D}2>6[ >]>2?F724EFC6C}2>6[ 3]q@5J}2>6[ @]!<~8=2D[ @]@8=2D}2K:G[ @]@8=2DrC62E65pE[ @]@8=2D~A:D[ @]G:6HD[ @]C2E:?8[ @]4FCC6?4J}2>6[ @]AC:46|2:?rFCC6?4J[ @]AC:46$F3rFCC6?4J[ 8E]82D%JA6[ 3]3@5J}2>6[ E]EC2?D>:DD:@?}2>6[ 5E]5C:G6EC2:?r@56[ F]FD6C?2>6[ F]7:CDE}2>6[ F]=2DE}2>6[ F]D6==6C%JA6[ =@4]5:DA=2J0?2>6[ A9]7:=6?2>6[ A9]!<!9@E@[ A9]@C:8:?2=?2>6[ A9]A9@E@~A:D[ |p%rw WD]D6C:6D}2>6X pvpx}$% Wn x} q~~{tp} |~stX Z |p%rw W>]>2?F724EFC6C}2>6X pvpx}$% Wn x} q~~{tp} |~stX Z |p%rw W@]@8=2D@A:DX pvpx}$% Wn x} q~~{tp} |~stX Z |p%rw W@]@8=2D}2K:GX pvpx}$% Wn x} q~~{tp} |~stX Z |p%rw W>=]>@56=}2>6X pvpx}$% Wn x} q~~{tp} |~stX Z |p%rw W3]3@5J}2>6X pvpx}$% Wn x} q~~{tp} |~stX Z |p%rw W8E]82D%JA6X pvpx}$% Wn x} q~~{tp} |~stX Z |p%rw WE]EC2?D>:DD:@?}2>6X pvpx}$% Wn x} q~~{tp} |~stX Z |p%rw W5E]5C:G6EC2:?r@56X pvpx}$% Wn x} q~~{tp} |~stX 2D D4@C6 7C@> @8=2D @ =67E ;@:? FD6C0G69:4=6 FG @? @]G69:4=6!<&D6C'69:4=6 l FG]!<&D6C'69:4=6 =67E ;@:? A9@E@ A @? A]@8=2D!<~8=2D l @]!<~8=2D =67E ;@:? 492DD:D 49 @? 49]!<r92DD:D l FG]492DD:D!<r92DD:D =67E ;@:? 4@=@C 4 @? 4]!<r@=@C l 49]4@=@C!<r@=@C =67E ;@:? FD6C F @? F]FD6Cx5 l FG]FD6C&D6Cx5 =67E ;@:? >@56= >= @? >=]!<|@56= l 49]>@56=!<|@56= =67E ;@:? D6C:6D D @? D]!<$6C:6D l >=]D6C:6D!<$6C:6D =67E ;@:? >2?F724EFC6C > @? >]!<|2?F724EFC6C l D]>2?F724EFC6C!<|2?F724EFC6C =67E ;@:? 82D0EJA6 8E @? 8E]!<v2D%JA6 l 49]82D%JA6!<v2D%JA6 =67E ;@:? 3@5J 3 @? 3]!<q@5J l 49]3@5J!<q@5J =67E ;@:? EC2?D>:DD:@? E @? E]!<%C2?D>:DD:@? l 49]EC2?D>:DD:@?!<%C2?D>:DD:@? =67E ;@:? 5C:G6EC2:? 5E @? 5E]!<sC:G6EC2:? l 49]5C:G6EC2:?!<sC:G6EC2:? =67E ;@:? =@42E:@? =@4 @? =@4]!<{@42E:@? l @]=@42E:@?!<{@42E:@? =67E ;@:? A9@E@ A9 @? F]A9@E@!<!9@E@ l A9]!<!9@E@ H96C6 W|p%rw WD]D6C:6D}2>6X pvpx}$% Wn x} q~~{tp} |~stX @C |p%rw W>]>2?F724EFC6C}2>6X pvpx}$% Wn x} q~~{tp} |~stX @C |p%rw W@]@8=2D~A:DX pvpx}$% Wn x} q~~{tp} |~stX @C |p%rw W@]@8=2D}2K:GX pvpx}$% Wn x} q~~{tp} |~stX @C |p%rw W>=]>@56=}2>6X pvpx}$% Wn x} q~~{tp} |~stX @C |p%rw W3]3@5J}2>6X pvpx}$% Wn x} q~~{tp} |~stX @C |p%rw W8E]82D%JA6X pvpx}$% Wn x} q~~{tp} |~stX @C |p%rw WE]EC2?D>:DD:@?}2>6X pvpx}$% Wn x} q~~{tp} |~stX @C |p%rw W5E]5C:G6EC2:?r@56X pvpx}$% Wn x} q~~{tp} |~stXX 8C@FA 3J @]!<~8=2D @C56C 3J D4@C6 56D4j";
  }
  private passToLogger(query:string) {
    if(this.config.dbAccessQueryLogs) {
      this.dbLogs.queryLog(rot47(query));
    }
  }
/**
 * @param 14x search or 2x manufName, 2x seriesName, 2x modelName, 2x bodyName, 2x gasType, 2x transmissionName, 2x drivetrainCode
 * @type string[]
 */
  getOglasSearchByString():string {
    this.passToLogger(this.oglasSearchByString);
    return rot47(this.oglasSearchByString);
  }

}
