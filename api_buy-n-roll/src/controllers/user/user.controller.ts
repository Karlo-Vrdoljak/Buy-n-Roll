import { Controller, UseGuards, Post, Request, Res, HttpService, Get, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { Response } from 'express';
import { Config } from 'src/config';
import { User } from 'src/entity/user.entity';
import { UsersService } from 'src/users/users.service';
import { Location } from 'src/entity/location.entity';
import { LocationService } from 'src/users/location/location.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync, fstat } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path'
import { PhotoService } from 'src/users/oglas/photo/photo.service';
import { Photo } from 'src/entity/photo.entity';
import { PhotoDescriptions } from 'src/types/enums';
import * as nodemailer from 'nodemailer';
import { Role } from 'src/entity/role.entity';
@Controller('user')
export class UserController {

  constructor(
    private http: HttpService,
    private config: Config,
    private userService: UsersService, 
    private locationService: LocationService, 
    private photoService: PhotoService,
    ) {}

  @Post('/findLocation/query')
  async findLocationByQuery(@Request() req, @Res() res: Response) {

    this.http.get(encodeURI(`https://eu1.locationiq.com/v1/search.php?key=${this.config.locationIQ_token}&q=${req.body.search}&format=json&normalizeaddress=1&normalizecity=1&accept-language=${req.body.lang}`))
      .subscribe(result => {
        res.status(200).send(result.data);
        
      }, err => {
        res.status(500).send(err);
      });
  }
  @Post('/register')
  async registerUserStepOne(@Request() req, /*@Res() res: Response*/) {
    console.log(req.body);
    let user = new User();
    user.email = req.body.email;
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.username = req.body.username;
    let role_user = new Role();
    role_user.name = 'user';
    await this.userService.roleService.getRepo().save(role_user);
    let roles = [role_user];
    user.roles = roles;
    if(req.body.place_id) {
      let location = new Location();
      location.place_id = req.body.place_id;
      location.boundingbox = req.body.boundingbox;
      location.class = req.body.class;
      location.display_name = req.body.display_name;
      location.lat = req.body.lat;
      location.lon = req.body.lon;
      location.type = req.body.type;
      let dbLocation = await this.locationService.getRepo().createQueryBuilder('l').where("l.place_id = :place_id", { place_id: req.body.place_id }).getOne();
      if(!dbLocation) {
        await this.locationService.getRepo().save(location);
        user.location = location;
      } else {
        user.location = dbLocation;
      }
    }
    user.password = await this.userService.getHash(req.body.password);
    user.phone = req.body.phone
    user.sellerType = req.body.sellerType;
    this.userService.getUserRepo().save(user);
    return user;
    // res.sendStatus(200);
  }

  @Post('/registerFinalize')
  async registerUserStepTwo(@Request() req, @Res() res: Response) {
    console.log(req.body.username);
    this.sendMailToNewUser(await this.userService.getUserRepo().createQueryBuilder('u').where('u.username = :username', {username: req.body.username}).addSelect('u.userCode').getOne(), req.body.lang).then((result:any) => {
      if (result instanceof Error) {
        res.status(HttpStatus.SERVICE_UNAVAILABLE).send();
      } else {
        res.status(HttpStatus.OK).send();
      }
    });
    // res.sendStatus(200);
  }

  @Post('/check/username')
  async checkUsername(@Request() req, @Res() res: Response) {
    let count = await this.userService.getUserRepo().createQueryBuilder('u').where('u.username = :uname', {uname: req.body.username}).getCount();
    if(count == 0) {
      res.status(HttpStatus.ACCEPTED).send();
    } else {
      res.status(HttpStatus.CONFLICT).send();
    }
  }

  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: async (req: Request, file: any, cb: any) => {
          // console.log("body",req.headers['username-value'],"FILE",file);
          
          const uploadPath = path.join(__dirname + '/../../assets/static/uploads');
          // Create folder if doesn't exist
          
          console.log(uploadPath) ;
          
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath);
          }
          if(!existsSync(path.join(uploadPath + '/' + req.headers['username-value']))) {
            mkdirSync(path.join(uploadPath + '/' + req.headers['username-value']));
          }
          cb(null, path.join(uploadPath + '/' + req.headers['username-value']));
        },
        filename: (req, file, callback) => {
          callback(null, `${Date.now()}.${uuidv4()}.${extname(file.originalname)}`);
        }
      }),
    }),
  )
  async uploadFile(@UploadedFile() req, @Res() res: Response) {
    let photo = new Photo();
    photo.destination = req.destination;
    photo.encoding = req.encoding;
    photo.fieldname = req.fieldname;
    photo.filename = req.filename;
    photo.mimetype = req.mimetype;
    photo.originalname = req.originalname;
    photo.path = req.path;
    photo.photoOpis = PhotoDescriptions.USER;
    photo.photoTitle = (req.originalname as string).split('.')[1];
    photo.size = req.size;
    
    let user = await this.userService.findOne((req.destination as string).split("\\").pop());
    if(user) {
      await this.photoService.getRepo().save(photo);
      user.photo = photo;
      await this.userService.getUserRepo().save(user);
      res.status(HttpStatus.CREATED).send();
    } else {
      res.status(HttpStatus.FAILED_DEPENDENCY).send();
    }
  }

  public async sendMailToNewUser(user:User,lang:string = 'en'): Promise<void> {
    let msg = {} as any;
    if(lang == 'hr') {
      msg = {
        subject: `Poštovani ${user.lastName} ${user.firstName}, dostavljamo vam vaš potvrdni kôd`,
        text: `Potvrdni kôd: ${user.userCode}`,
        textHtml:`<div style="display:flex;flex-direction: column;width:100%;font-size: 18px;flex-direction: column;color: #393f4d;">
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
      msg = {
        subject: `Dear ${user.lastName} ${user.firstName}, your verification code is delivered`,
        text: `Verification code: ${user.userCode}`,
        textHtml:`<div style="display:flex;flex-direction: column;width:100%;font-size: 18px;flex-direction: column;color: #393f4d;">
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
    let transporter = nodemailer.createTransport({
      host: 'smtp.googlemail.com', // Gmail Host
      port: 465, // Port
      secure: true, // this is true as port is 465
      auth: {
          user: 'app.buy.n.roll', // generated ethereal user
          pass: 'buynroll123', // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Buy\'n\'Roll" <app.buy.n.roll@gmail.com>', // sender address
      to: user.email, // list of receivers
      subject: msg.subject, // Subject line
      text: msg.text, // plain text body
      html: msg.textHtml
    });

    console.log("Message sent: %s", info.messageId);
  }
}

