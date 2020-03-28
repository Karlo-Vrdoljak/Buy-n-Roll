import { Injectable } from "@nestjs/common";

@Injectable()
export class DbLogs {
    vehicleColorInit() { console.info('[APP]', new Date().toLocaleString('hr'),"Successfully initialized vehicle Color table data!"); }
    usersWithRolesInit() { console.info('[APP]', new Date().toLocaleString('hr'),"Successfully initialized User and Roles table data!"); }

    warnNeedsInit(label:string) { console.warn('[APP]', new Date().toLocaleString('hr'),label + " needs init!"); }
}
