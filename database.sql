create table player (id serial primary key, firstname text, lastname text, email text, score integer, submit_date timestamp, duration integer);
create table reponse (id serial primary key, f_player_id serial, type text, index integer, question text, reponse integer, bonne_reponse integer, temps_reponse integer);

create table question (id serial primary key, type text, index integer, libelle text, reponse_1 text, reponse_2 text, reponse_3 text, reponse_4 text, bonne_reponse integer);

insert into question values (1, 'Web', 1, 'Quelle librairie JavaScript développée par Facebook est devenu l''une des solutions les plus utilisées pour développer des application Web ?', 'jQuery', 'Prototype', 'Flow', 'React', 4);
insert into question values (2, 'Web', 2, 'Quel task runner très utilisé se base sur le système de Stream de NodeJS pour définir l''ordre d''exécution de votre workflow ?', 'Grunt', 'Maven', 'Gulp', 'Broccoli' , 3);

insert into question values (3, 'BigData', 1, 'En 2016 est apparue la Stack Big Data SMACK. Chaque lettre de l''acronyme SMACK correspond à une technologie Big data. Êtes vous capable de citer l''ensemble des technologies ?', 'Samza, Microservice, Avro, CouchDB, Kubernetes', 'Storm, Mahout, Ambari, CouchBase, Kudu', 'Spark, Mesos, Akka, Cassandra, Kafka', 'La réponse D', 3);
insert into question values (4, 'BigData', 2, 'Lequel de ces termes ne désigne pas un algorithmes de Machine Learning', 'Atomic regression', 'Random forest', 'K-Means', 'SVM', 1);

insert into question values (5, 'DevOps', 1, 'Que signifie l''acronyme “CAMS”', 'Collaboration As a Measurable System', 'Culture Automation Measurement Share', 'Container Automated Multiple Services', 'Call Asap My Sysadmin', 2);
insert into question values (6, 'DevOps', 2, 'Lequel de ces termes ne désigne pas un outil d''intégration continue ', 'TravisCI', 'CircleCI', 'ChanCI', 'Jenkins', 3);

insert into question values (7, 'Agile', 1, 'Comment Scrum garantit la qualité du produit ?', 'En injectant des testeurs au sein de l''équipe de réalisation', 'En exigeant que tous les “test cases” soient rédigés avant le début du sprint', 'En ajoutant un sprint de stabilisation pour éxécuter tous les QA', 'En negociant une définition de “terminé” entre le PO et les équipes de réalisation', 4);
insert into question values (8, 'Agile', 2, 'Comment sont distribuées les responsabilités du chef de projet au sein d''une équipe Scrum ?', 'Il n''y pas de Chef de Projet dans une équipe Scrum', 'Les responsabilités sont distribuées entre le SM, l''équipe de réalisation et le PO', 'Le SM assume les reponsabilités du Chef de Projet', 'Le PO assume les responsabilités du Chef de Projet', 2);

insert into question values (9, 'Craftsmanship', 1, 'Question 1 Que signifie l''acronyme “KISS” ?', 'Keep It Simple Stupid', 'Keep Integers Super Small', 'Keep Imagine Simple Solutions', 'Kirikou Is Super Strong', 1);
insert into question values (10, 'Craftsmanship', 2, 'Quel langage ne peut pas se voir appliquer les principes du Craftsmanship ?', 'Java', 'C#', 'Javascript', 'Aucun' , 4);

insert into question values (11, 'IOT', 1, 'Quelle réponse n''est pas une technologie de communication de l''IoT ?', 'Lora', 'AMQP', 'BLE', 'Sigfox', 2);
insert into question values (12, 'IOT', 2, 'Que signifie CQRS ?', 'Command and Query Responsibility Segregation', 'Control of Quality Responsability Systems', 'Connnected and Qualified Responsive Systems', 'Comment Qualifier cette Réponse Simplement', 1);

insert into question values (13, 'Java', 1, 'Quelle phrase au sujet de Java est correcte ?', 'En Java, les types de base ne sont pas des objets', 'Java supporte l''héritage multiple entre les classes', 'En Java, on peut affecter soi-même l''adresse d''un pointeur', 'Java supporte la surcharge des opérateurs' , 1);
insert into question values (14, 'Java', 2, 'Comment indiquer qu''une classe A hérite d''une classe B ?', 'class A ::B', 'class A extends B', 'class A implements B', 'class A inherit B' , 2);