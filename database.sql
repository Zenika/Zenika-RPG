create table player (id serial primary key, firstname text, lastname text, email text, score integer, submit_date timestamp);
create table reponse (id serial primary key, f_player_id serial, type text, index integer, question text, reponse integer, bonne_reponse integer, temps_reponse integer);
