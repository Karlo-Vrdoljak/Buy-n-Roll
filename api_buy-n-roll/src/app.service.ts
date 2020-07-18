import { Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';

@Injectable()
export class AppService {
  
  async generateEmailRegister(user:User,lang:string) {
    if(lang == 'hr') {
      return {
        subject: `Poštovani ${user.lastName} ${user.firstName}, dostavljamo vam vaš potvrdni kôd`,
        text: `Potvrdni kôd: ${user.userCode}`,
        textHtml:`<div style="width:100%;font-size: 18px;color: #393f4d;">
        <div style="width:100%;font-size: 16px;">
          Hvala vam na korištenju <strong>Buy'n'Roll </strong>usluge!</div>
        <div style="font-size:18px;color:#393f4d;width: 25%;">Potvrdni kôd:</div>
        <div style="font-size:18px;color:#393f4d;width: 75%;padding: 0.5rem 0;">${user.userCode}</div>
        <div style="width: 100%;font-size: 16px;">
          Kopirajte kôd i zalijepite ga na odgovarajuće mjesto u aplikaciji.
        </div>
      </div>
      </div>`
      };
    } else if(lang == 'en') {
      return {
        subject: `Dear ${user.lastName} ${user.firstName}, your verification code is delivered`,
        text: `Verification code: ${user.userCode}`,
        textHtml:`<div style="width:100%;font-size: 18px;color: #393f4d;">
        <div style="width:100%;font-size: 16px;">
          Thank you for using the <strong>Buy'n'Roll </strong>service!</div>
        <div style="font-size:18px;color:#393f4d;width: 25%;">Verification code:</div>
        <div style="font-size:18px;color:#393f4d;width: 75%;padding: 0.5rem 0;">${user.userCode}</div>
        <div style="width: 100%;font-size: 16px;">
        Copy the code and paste it in the appropriate place in the application.
        </div>
      </div>
      </div>`
      };
    }
  }
}
