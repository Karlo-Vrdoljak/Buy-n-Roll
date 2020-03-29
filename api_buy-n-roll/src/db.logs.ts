import { Injectable } from "@nestjs/common";

@Injectable()
export class DbLogs {
    successInit(label:string) { console.info('[APP]', new Date(),"Successfully initialized ",label," table data!"); }
    warnNeedsInit(label:string) { console.warn('[APP]', new Date(),label + " needs init!"); }
    initializing(num){ console.info('[APP]', new Date(),"Initializing", num + '%'); }
    done(){ console.info('[APP]', new Date(),"Done!"); }
}
