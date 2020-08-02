import { HttpService, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { DbLogs } from 'src/db.logs';
import { Oglas } from 'src/entity/oglas.entity';
import { PhotoDescriptions } from 'src/types/enums';
import { Location } from 'src/entity/location.entity';
import { Favourites } from 'src/entity/favourites.entity';
import { Comments } from 'src/entity/comments.entity';
import { User } from 'src/entity/user.entity';
import { Photo } from 'src/entity/photo.entity';

import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import {readFile, readFileSync} from 'fs';
import * as fontkit from '@pdf-lib/fontkit';
import path = require('path');


@Injectable()
export class OglasService implements OnModuleInit {

  constructor(
    @InjectRepository(Oglas)
    private readonly oglasRepository: Repository<Oglas>,
    public dbLogs:DbLogs,
    private connection: Connection
  ) {}

  onModuleInit() {
    this.oglasRepository.count().then(count => {
        if(count == 0) { }
    });
  }

  findAll(): Promise<Oglas[]> {
    return this.oglasRepository.find();
  }

  findOne(PkOglas: number): Promise<Oglas> {
    return this.oglasRepository.findOne(PkOglas);
  }

  async remove(PkOglas: number): Promise<void> {
    await this.oglasRepository.delete(PkOglas);
  }

  getRepo() {
    return this.oglasRepository;
  }
  getConnection() {
    return this.connection;
  }
  findOglasiByUsername(username:string) {
    return this.oglasRepository.createQueryBuilder('o')
    .leftJoinAndSelect("o.photos","p","p.oglas")
    .leftJoinAndSelect("o.vehicle","v")
    .leftJoinAndSelect("o.location","l")
    .leftJoinAndSelect("v.user","u")
    .leftJoinAndSelect("v.chassis","ch")
    .leftJoinAndSelect("ch.color","c")
    .leftJoinAndSelect("ch.model","ml")    
    .leftJoinAndSelect("ch.drivetrain","dt")
    .leftJoinAndSelect("ch.transmission","tr")
    .leftJoinAndSelect("ch.gasType","gt")
    .leftJoinAndSelect("ch.body","b")
    .leftJoinAndSelect("ml.series","s")
    .leftJoinAndSelect("s.manufacturer","m")
    .where('u.username = :uname', { uname: username })
    .getMany()
  }
  findOglasByPk(pk:number) {
    return this.oglasRepository.createQueryBuilder('o')
    .leftJoinAndSelect("o.photos","p","p.oglas")
    .leftJoinAndSelect("o.vehicle","v")
    .leftJoinAndSelect("o.location","l")
    .leftJoinAndSelect("v.user","u")
    .leftJoinAndSelect("u.location","loc")
    .leftJoinAndSelect("v.chassis","ch")
    .leftJoinAndSelect("ch.color","c")
    .leftJoinAndSelect("ch.model","ml")
    .leftJoinAndSelect("ch.drivetrain","dt")
    .leftJoinAndSelect("ch.transmission","tr")
    .leftJoinAndSelect("ch.gasType","gt")
    .leftJoinAndSelect("ch.body","b")
    .leftJoinAndSelect("ml.series","s")
    .leftJoinAndSelect("s.manufacturer","m")
    .where('o.PkOglas = :PkOglas', { PkOglas: pk })
    .getOne();
  }
  
  findOglasPhotosByPkOglas(pkOglas) {
    return this.oglasRepository.createQueryBuilder('o')
      .leftJoinAndSelect("o.photos","p","p.oglas")
      .where('o.PkOglas = :PkOglas', { PkOglas: pkOglas })
      .andWhere('p.photoOpis = :key', {key: PhotoDescriptions.OGLAS}).getOne();
  }

  
  async handleSaveLocation(locationData:Location) {
    if(locationData.place_id) {
      let location = new Location();
      location.place_id = locationData.place_id;
      location.boundingbox = locationData.boundingbox;
      location.class = locationData.class;
      location.display_name = locationData.display_name;
      location.lat = locationData.lat;
      location.lon = locationData.lon;
      location.type = locationData.type;
      await this.connection.getRepository(Location).save(location);
      return location;
    }
  }

  async checkFavourite(oglas:Oglas, pkUser) {
    if(oglas) {
      if(pkUser) {
        let userFavourite = await this.getConnection().createQueryBuilder(Favourites,'f')
          .where('f.userUserId = :id', {id : pkUser})
          .andWhere('f.oglasPkOglas = :pkOglas', {pkOglas: oglas.PkOglas}).getRawOne();
        if(userFavourite) {
          oglas['alreadyFavourited'] = true;
        } else {
          oglas['alreadyFavourited'] = false;
        }
      }
      let rating = await this.getConnection().createQueryBuilder(Favourites, 'f')
        .where('f.oglasPkOglas = :pk', {pk: oglas.PkOglas})
        .getCount();
      
      oglas.rating = rating ?? 0; 
      return oglas;
    } else {
      return null;
    }
  }
  async findOglasComments(pkOglas) {
    let roots = await this.getConnection().getRepository(Comments).createQueryBuilder('c')
    .where('c.oglasPkOglas = :pk and c.parentId is null', {pk: pkOglas})
    .getMany();
    let comments = await Promise.all(roots.map(async root => {
      let tree = await this.getConnection().getTreeRepository(Comments).findDescendantsTree(root);
      tree = await this.traverse(tree);
      return tree;
    }));
    return comments;
  }

  async traverse(current:Comments) {
    //process current node here
    current.user = await this.getConnection().createQueryBuilder(User, 'u')
    .leftJoinAndSelect('u.photo','p')
    .where('u.userId = :pk', {pk: current.userId}).getOne();
    if(!current.user.photo?.filename) {
      current.user.photo = {
        PkPhoto: -1,
        filename: "assets/images/misc/noProfile.png"
      } as Photo;
    }
    //visit children of current
    for (var i in current.children) {
        await this.traverse(current.children[i]);
    }
    return current;
  }

  toTitleCase(str) {
    return str.replace(
        /\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
  }

  async generateKupoprodajni(data: any) {
      
    let prodavac = data.loadProdavac? await this.getConnection().createQueryBuilder(User,'u').where('u.userId = :pkp', { pkp: data.prodavacId })
      .leftJoinAndSelect('u.location', 'l')
      .getOne(): null;

    let kupac = data.loadKupac?  await this.getConnection().createQueryBuilder(User,'u').where('u.userId = :pkk', { pkk: data.kupacId })
      .leftJoinAndSelect('u.location', 'l')
      .getOne() : null;

    let oglas = await this.findOglasByPk(data.PkOglas);
    let original = readFileSync(path.join(__dirname , '/../../assets/static/ugovor.pdf'));

    const pdfDoc = await PDFDocument.load(original);
    pdfDoc.registerFontkit(fontkit);
    
    const helveticaFont = await pdfDoc.embedFont(readFileSync(path.join(__dirname , '/../../assets/static/mw.ttf')));

    // const supportedCharacters = helveticaFont
    // .getCharacterSet()
    // .map((codePoint) => String.fromCodePoint(codePoint))
    // .join('');
    // console.log(`Characters supported by font: ${supportedCharacters}\n`);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    
    const addText = (text:string, x:number, y:number, size = 12, key = '') => {
      if(data.useAllData || data.selectedProps?.includes(key)) {
        firstPage.drawText(text || '', {x, y, size, font: helveticaFont});
      }
    }
    if(prodavac) {
      addText(`${prodavac.firstName} ${prodavac.lastName}` , 40, 800, 12, 'firstName,lastName');
      addText(prodavac.location?.display_name , 40, 770, 10, 'display_name');
    }
    if(kupac) {
      addText(`${kupac.firstName} ${kupac.lastName}`, 40, 713, 12, 'firstName,lastName');
      addText(kupac.location?.display_name, 40, 683, 10, 'display_name');
    }
    addText('Osobno vozilo', 260, 565);
    addText(this.toTitleCase(oglas.vehicle.chassis.model.series.manufacturer.manufacturerName), 442, 565, 12, 'manufacturerName');
    addText(oglas.vehicle.chassis.color.color, 442, 542, 9, 'color');
    addText(oglas.vehicle.chassis.model.modelName, 258, 542, 9, 'modelName');
    addText(oglas.vehicle.chassis.model.series.seriesName, 94, 542, 9, 'seriesName');
    addText(oglas.vehicle.chassis.VIN, 94, 515, 12, 'VIN');
    addText(this.toTitleCase(oglas.vehicle.chassis.body.bodyName), 442, 515, 12, 'bodyName');
    addText(oglas.vehicle.chassis.makeYear, 316, 493, 12, 'makeYear');

    return await pdfDoc.save()
  }
}
