import { Controller, UseGuards, Post, Request, Res, HttpService, Get, HttpStatus, UseInterceptors, UploadedFile, Param, Put, Delete, UploadedFiles } from '@nestjs/common';
import { Response } from 'express';
import { Config } from 'src/config';
import { User } from 'src/entity/user.entity';
import { UsersService } from 'src/users/users.service';
import { Location } from 'src/entity/location.entity';
import { LocationService } from 'src/users/location/location.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync, fstat, unlinkSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path'
import { PhotoService } from 'src/users/oglas/photo/photo.service';
import { Photo } from 'src/entity/photo.entity';
import { PhotoDescriptions, PhotoTypes } from 'src/types/enums';
import * as nodemailer from 'nodemailer';
import { Role } from 'src/entity/role.entity';
import { OglasService } from 'src/users/oglas/oglas.service';
import { AppService } from 'src/app.service';
import { Favourites } from 'src/entity/favourites.entity';
import { AuthService } from 'src/auth/auth.service';
import { ModuleRef } from '@nestjs/core';
import { request } from 'http';
@Controller('user')
export class UserController {
  private auth:AuthService

  constructor(
    private http: HttpService,
    private config: Config,
    private userService: UsersService, 
    private locationService: LocationService, 
    private photoService: PhotoService,
    private oglasService: OglasService,
    private appService: AppService,
    private moduleRef: ModuleRef
    ) {
    this.auth = this.moduleRef.get(AuthService, {strict:false});

    }

  @Post('/findLocation/query')
  async findLocationByQuery(@Request() req, @Res() res: Response) {

    this.http.get(encodeURI(`https://eu1.locationiq.com/v1/search.php?key=${this.config.locationIQ_token}&q=${req.body.search}&format=json&normalizeaddress=1&normalizecity=1&accept-language=${req.body.lang}`))
      .subscribe(result => {
        res.status(HttpStatus.OK).send(result.data);
        
      }, err => {
        res.status(HttpStatus.SERVICE_UNAVAILABLE).send(err);
      });
  }

  @Get('/getPhoto/:query')
  async findPhotoByUsername(@Param() req) {
    return this.userService.findProfilePhotoByUsername(req.query);
  }

  @Delete('/photo/delete/:query')
  async deletePhotoByPk(@Param() req, @Res() res: Response) {
    let photo = await this.photoService.getRepo()
      .createQueryBuilder('p')
      .leftJoinAndSelect("p.oglas","o")
      .leftJoinAndSelect("o.vehicle","v")
      .leftJoinAndSelect("v.user","u")  
      .where('p.PkPhoto = :pk', {pk: req.query}).getOne();
    let pkOglas = photo.oglas.PkOglas;
    
    // res.status(HttpStatus.OK).send();
    // return;
    if(photo) {
      try {
        unlinkSync(path.join(__dirname + '/../../assets/static/uploads/' + photo.oglas.vehicle.user.username + '/' + photo.filename));
      } catch(err) {
        console.error(err);
      }
      await this.photoService.getRepo().remove(photo);
      let photos = await this.oglasService.findOglasPhotosByPkOglas(pkOglas);
      res.status(HttpStatus.OK).send(photos);
    }
    else {
      res.status(HttpStatus.FAILED_DEPENDENCY).send();
    }
  }

  @Get('/data/:query')
  async findUserByUsername(@Param() req, @Res() res: Response) {
    let user = await this.userService.findUserByUsernameFollowRelations(req.query);
    if(user) {
      res.status(HttpStatus.OK).send(user);
    } else {
      res.status(HttpStatus.EXPECTATION_FAILED).send();
    }
  }

  @Get('/favourites/:query')
  async findUsersFavouritedOglas(@Param() req, @Res() res: Response) {
    let users = await this.userService.getUserRepo()
      .createQueryBuilder('u')
      .innerJoinAndSelect('u.favourites','f')
      .leftJoinAndSelect('u.photo','p')
      .leftJoinAndSelect('f.oglas','o')
      .where('f.oglasPkOglas = :pk', {pk: req.query})
      .andWhere('(p.photoOpis is null or p.photoOpis = :opis)', { opis: PhotoDescriptions.USER })
      .getMany();
      
    if(users) {
      res.status(HttpStatus.OK).send(users);
    } else {
      res.status(HttpStatus.EXPECTATION_FAILED).send();
    }
  }
  @Get('/favourites/all/:query')
  async findUsersFavouritedAll(@Param() req, @Request() request, @Res() res: Response) {
    let favs = await this.userService.getUserRepo()
      .createQueryBuilder('u')
      .innerJoinAndSelect('u.favourites','f')
      .leftJoinAndSelect('u.photo','p')
      .leftJoinAndSelect('f.oglas','o')
      .where('f.userUserId = :pk', {pk: req.query})
      .getRawMany();
    if(favs) {
      
      let oglasi = await Promise.all(favs.map(async (f:any) => {
        return await this.oglasService.findOglasByPk(f.f_oglasPkOglas);
      }));
      if(oglasi) {
        if(request.headers?.authorization?.split('Bearer ')) {
          let token = request.headers.authorization.split('Bearer ')[1];
          let user = this.auth.decodeToken(token);
          oglasi =  await this.userService.checkFavourite(oglasi, user.sub);
        } else {
          oglasi =  await this.userService.checkFavourite(oglasi, null);

        }
      }
      res.status(HttpStatus.OK).send(oglasi || []);
    } else {
      res.status(HttpStatus.OK).send([]);
    }
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('user')
  @Post('/add/favourite')
  async toggleToFav(@Request() req, @Res() res: Response) {
    let fav = await this.userService.oglasService.getConnection().createQueryBuilder(Favourites,'f')
          .where('f.userUserId = :id', {id : req.user.userId})
          .andWhere('f.oglasPkOglas = :pkOglas', {pkOglas: req.body.PkOglas}).getOne();
    if(!fav) {
      let favourite = new Favourites();
      favourite.oglas = await this.oglasService.findOglasByPk(req.body.PkOglas);
      favourite.user = await this.userService.findOne(req.user.username);
      let result = await this.userService.oglasService.getConnection().createQueryBuilder()
        .insert().into(Favourites)
        .values(favourite).execute();
      if(result) {
        res.status(HttpStatus.OK).send(true);
      } else {
        res.status(HttpStatus.EXPECTATION_FAILED).send();
      }
    } else {
      await this.userService.favService.getRepo().remove(fav);
      res.status(HttpStatus.OK).send(false);
    }
  }


  @Post('/register')
  async registerUserStepOne(@Request() req, /*@Res() res: Response*/) {
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
      user.location = await this.userService.handleSaveLocation(req.body, user);
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
    this.sendMailToNewUser(await this.userService.getUserRepo().createQueryBuilder('u').where('u.username = :username', {username: req.body.username}).addSelect('u.userCode').getOne(), req.body.lang).then((result:any) => {
      if (result instanceof Error) {
        res.status(HttpStatus.SERVICE_UNAVAILABLE).send();
      } else {
        res.status(HttpStatus.OK).send();
      }
    }).catch(() => {
      res.status(HttpStatus.SERVICE_UNAVAILABLE).send();
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

  @Post('/check/code')
  async checkCode(@Request() req, @Res() res: Response) {
    let user = await this.userService.getUserRepo().createQueryBuilder('u').where('u.username = :uname', {uname: req.body.username}).addSelect('u.userCode').getOne();
    if(user) {
      if(user.userCode == req.body.code) {
        user.isActive = true;
        await this.userService.getUserRepo().save(user);
        res.status(HttpStatus.ACCEPTED).send();
      } else {
        res.status(HttpStatus.EXPECTATION_FAILED).send();
      }
    } else {
      res.status(HttpStatus.NOT_FOUND).send();
    }
  }

  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: async (req: Request, file: any, cb: any) => {
          
          const uploadPath = path.join(__dirname + '/../../assets/static/uploads');
          // Create folder if doesn't exist
          
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
    
    let user = await this.userService.findUserByUsernameFollowRelations((req.destination as string).split("\\").pop());
    if(user) {
      await this.photoService.getRepo().save(photo);
      let photoForRemoval = null;
      if(user.photo) {
        photoForRemoval = user.photo;
      }
      user.photo = photo;
      await this.userService.getUserRepo().save(user);
      if(photoForRemoval) {
        try {
          unlinkSync(path.join(__dirname + '/../../assets/static/uploads/' + user.username + '/' + photoForRemoval.filename));
        } catch(err) {
          console.error(err);
        }
        await this.photoService.getRepo().remove(photoForRemoval);
      }
      res.status(HttpStatus.CREATED).send();
    } else {
      res.status(HttpStatus.FAILED_DEPENDENCY).send();
    }
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('user')
  @Put('/save/edit')
  async saveUserProfileData(@Request() req, @Res() res: Response) {
    let user = await this.userService.findUserByUsernameFollowRelations(req.body.username);
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.sellerType = req.body.sellerType;
    user.phone = req.body.phone;
    let pkLocation = null;
    if(user.location == null && req.body.location) {
      user.location = await this.userService.handleSaveLocation(req.body.location, user)
    }
    else if(user.location && (req.body.place_id != user.location.place_id)) {
      pkLocation = user.location.PkLocation;
      user.location = await this.userService.handleSaveLocation(req.body.location, user);
    }
    await this.userService.getUserRepo().save(user).catch(err => {
      console.error(err);
      res.status(HttpStatus.NOT_ACCEPTABLE).send();
    });
    if (pkLocation != null) {
      await this.userService.deleteOldLocation(pkLocation);
    }
    res.status(HttpStatus.OK).send();
    
  }


  public async sendMailToNewUser(user:User,lang:string = 'en'): Promise<void> {
    let msg = await this.appService.generateEmailRegister(user,lang);
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

  }

  @Get('/oglasi/username/:query')
  async getOglasiByUsername(@Param() params, @Res() res: Response) {
    let user = await this.userService.findUserByUsernameFollowRelations(params.query);
    if(!user) {
      res.status(HttpStatus.EXPECTATION_FAILED).send();
    } else { 
      let oglasi = await this.oglasService.findOglasiByUsername(user.username);
      if(oglasi) {
        oglasi =  await this.userService.checkFavourite(oglasi, user.userId);
      }
      res.status(HttpStatus.OK).send(oglasi);
    }
  }

  @Post('/upload/multi')
  @UseInterceptors(
    FilesInterceptor('image', 40, {
      storage: diskStorage({
        destination: async (req: Request, file: any, cb: any) => {
          
          const uploadPath = path.join(__dirname + '/../../assets/static/uploads');
          // Create folder if doesn't exist
          
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
  async uploadFileMulti(@UploadedFiles() files, @Request() request, @Res() res: Response) {

    let pkOglas = request.headers['pk-oglas'];
    
    let photos = files.map(f => this.photoService.generatePhotoOglas(f)) as Photo[];

    let oglas = await this.oglasService.getRepo()
    .createQueryBuilder('o')
    .leftJoinAndSelect("o.photos","p","p.oglas")
    .where('o.PkOglas = :PkOglas', { PkOglas: pkOglas }).getOne();
    
    await Promise.all(photos.map(async p => {
      await this.photoService.getRepo().save(p);
    }));
    oglas.photos.push(...photos);

    await this.oglasService.getRepo().save(oglas);
    let result = await this.oglasService.findOglasPhotosByPkOglas(pkOglas);
    res.status(HttpStatus.CREATED).send(result);
  }

}

