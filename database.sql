create table player (id serial primary key, firstname text, lastname text, email text, score integer, submit_date timestamp, duration integer);
create table reponse (id serial primary key, f_player_id serial, type text, index integer, question text, reponse integer, bonne_reponse integer, temps_reponse integer);

create table question (id serial primary key, type text, index integer, libelle text, reponse_1 text, reponse_2 text, reponse_3 text, reponse_4 text, bonne_reponse integer);

insert into question values (1, 'Web', 1, 'Quelle librairie JavaScript développée par Facebook est devenu l’une des solutions les plus utilisées pour développer des application Web ?', 'jQuery', 'Prototype', 'Flow', 'React', 4);

insert into question values (2, 'BigData', 2, 'Question BigData 1 ?', 'Réponse A', 'Réponse B', 'Réponse C', 'Réponse D', 3);

insert into question values (3, 'DevOps', 1, 'Question DevOps 1 ?', 'Réponse A', 'Réponse B', 'Réponse C', 'Réponse D', 1);

insert into question values (4, 'Agile', 1, 'Question Agilité 1 ?', 'Réponse A', 'Réponse B', 'Réponse C', 'Réponse D', 3);
insert into question values (5, 'Agile', 2, 'Question Agilité 2 ?', 'Réponse A', 'Réponse B', 'Réponse C', 'Réponse D', 2);

insert into question values (6, 'Craftsmanship', 1, 'Question 1 Que signifie l''acronyme «KISS» ?', 'Keep It Simple Stupid', 'Keep Integers Super Small', 'Keep Imagine Simple Solutions', 'Kirikou Is Super Strong', 1);
insert into question values (7, 'Craftsmanship', 2, 'Quel langage ne peut pas se voir appliquer les principes du Craftsmanship ?', 'Java', 'C#', 'Javascript', 'Aucun' , 4);

insert into question values (8, 'IOT', 1, 'Quelle réponse n’est pas une technologie de communication de l’IoT ?', 'Lora', 'AMQP', 'BLE', 'Sigfox', 2);

insert into question values (9, 'Java', 1, 'Question Java 1 ?', 'Réponse A', 'Réponse B', 'Réponse C', 'Réponse D' , 1);
insert into question values (10, 'Java', 2, 'Question Java 2 ?', 'Réponse A', 'Réponse B', 'Réponse C', 'Réponse D' , 3);

insert into question values (11, 'Web', 2, 'Du blabla', 'Réponse A', 'Réponse B', 'Réponse C', 'Réponse D' , 0);
insert into question values (12, 'BigData', 1, 'Du blabla bigdata', 'Réponse A', 'Réponse B', 'Réponse C', 'Réponse D' , 0);