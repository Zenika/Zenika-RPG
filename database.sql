create table player (id serial primary key, firstname text, lastname text, email text, score integer, submit_date timestamp);
create table reponse (id serial primary key, f_player_id serial, type text, index integer, question text, reponse integer, bonne_reponse integer, temps_reponse integer);

create table question (id serial primary key, type text, index integer, libelle text, reponse_1 text, reponse_2 text, reponse_3 text, reponse_4 text, bonne_reponse integer);
insert into question values (1, 'Web', 1, 'Quelle est le principal défaut de AngularJS (V1) ?', 'La productivité est faible', 'La communauté n''est pas active', 'Le framework est trop complexe', 'La création de composant n''est pas simple', 4);
insert into question values (2, 'BigData', 1, 'Question BigData 1 ?', 'Réponse A', 'Réponse B', 'Réponse C', 'Réponse D', 3);
insert into question values (3, 'DevOps', 1, 'Question DevOps 1 ?', 'Réponse A', 'Réponse B', 'Réponse C', 'Réponse D', 1);
insert into question values (4, 'Agile', 1, 'Question Agilité 1 ?', 'Réponse A', 'Réponse B', 'Réponse C', 'Réponse D', 3);
insert into question values (5, 'Agile', 2, 'Question Agilité 2 ?', 'Réponse A', 'Réponse B', 'Réponse C', 'Réponse D', 2);
insert into question values (6, 'Craftsmanship', 1, 'Question Craftsmanship 1 ?', 'Réponse A', 'Réponse B', 'Réponse C', 'Réponse D', 4);
insert into question values (7, 'Craftsmanship', 2, 'Question Craftsmanship 2 ?', 'Réponse A', 'Réponse B', 'Réponse C', 'Réponse D' , 1);
insert into question values (8, 'IOT', 1, 'Question IOT 1 ?', 'Réponse A', 'Réponse B', 'Réponse C', 'Réponse D', 2);
insert into question values (9, 'Java', 1, 'Question Java 1 ?', 'Réponse A', 'Réponse B', 'Réponse C', 'Réponse D' , 1);
insert into question values (10, 'Java', 2, 'Question Java 2 ?', 'Réponse A', 'Réponse B', 'Réponse C', 'Réponse D' , 3);
