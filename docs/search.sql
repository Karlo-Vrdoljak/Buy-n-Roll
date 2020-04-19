drop table user_vehicle;
drop table role;
drop table user;

select * from series where seriesName like '%astra 3 doors%' limit 1;

select * from model where modelName like '%gsi 16v%';

select * from user;

select * from chassis;

select * from user_vehicle;

select * from color where color = 'midnight blue';

select * from color where match (color) against ('midnight blue' IN BOOLEAN MODE);

-- inline regex slowest
select  s.seriesName, s.PkSeries,  m.manufacturerName, m.PkManufacturer, ml.modelName, ml.PkModel, ml.endOfProductionYear from series s
left join manufacturer m on s.manufacturerPkManufacturer  = m.PkManufacturer
left join model ml on s.PkSeries = ml.seriesPkSeries
where concat_ws( ' ',m.manufacturerName, s.seriesName, ml.modelName) rlike '(?=.*gsi)(?=.*opel)(?=.*astra)(?=.*2.0)(?=.*16)(?=.*hp)';

-- fastest result
select  s.seriesName, s.PkSeries,  m.manufacturerName, m.PkManufacturer, ml.modelName, ml.PkModel, ml.endOfProductionYear from series s
left join manufacturer m on s.manufacturerPkManufacturer  = m.PkManufacturer
left join model ml on s.PkSeries = ml.seriesPkSeries
where MATCH (s.seriesName)
AGAINST ('gsi opel astra 2.0 16 hp' IN BOOLEAN MODE)
and MATCH (m.manufacturerName)
AGAINST ('gsi opel astra 2.0 16 hp' IN BOOLEAN MODE)
and MATCH (ml.modelName)
AGAINST ('gsi opel astra 2.0 16 hp' IN BOOLEAN MODE);


