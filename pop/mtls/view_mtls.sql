CREATE VIEW count_app_yesterday AS SELECT * FROM dblink('dbname=lcs_main host=localhost user=lcser password=loveu', 'SELECT COUNT(*) FROM appinfo WHERE intime > current_date - 1 AND intime < current_date') AS t1(cc int);

CREATE VIEW count_user_yesterday AS SELECT * FROM dblink('dbname=lcs_main host=localhost user=lcser password=loveu', 'SELECT COUNT(*) FROM userinfo WHERE intime > current_date - 1 AND intime < current_date') AS t1(cc int);

CREATE VIEW count_join_yesterday AS SELECT * FROM dblink('dbname=lcs_dyn host=localhost user=lcser password=loveu', 'SELECT COUNT(*) FROM lcsjoin WHERE intime > current_date - 1 AND intime < current_date') AS t1(cc int);

CREATE VIEW count_visit_yesterday AS SELECT * FROM dblink('dbname=lcs_dyn host=localhost user=lcser password=loveu', 'SELECT COUNT(*) FROM visit WHERE intime > current_date - 1 AND intime < current_date') AS t1(cc int);

CREATE VIEW count_msg_yesterday AS SELECT * FROM dblink('dbname=lcs_msg host=localhost user=lcser password=loveu', 'SELECT COUNT(*) FROM msg WHERE intime > current_date - 1 AND intime < current_date') AS t1(cc int);

CREATE VIEW count_app_total AS SELECT * FROM dblink('dbname=lcs_main host=localhost user=lcser password=loveu', 'SELECT COUNT(*) FROM appinfo') AS t1(cc int);
CREATE VIEW count_user_total AS SELECT * FROM dblink('dbname=lcs_main host=localhost user=lcser password=loveu', 'SELECT COUNT(*) FROM userinfo') AS t1(cc int);
CREATE VIEW count_join_total AS SELECT * FROM dblink('dbname=lcs_dyn host=localhost user=lcser password=loveu', 'SELECT COUNT(*) FROM lcsjoin') AS t1(cc int);
CREATE VIEW count_visit_total AS SELECT * FROM dblink('dbname=lcs_dyn host=localhost user=lcser password=loveu', 'SELECT COUNT(*) FROM visit') AS t1(cc int);
CREATE VIEW count_msg_total AS SELECT * FROM dblink('dbname=lcs_msg host=localhost user=lcser password=loveu', 'SELECT COUNT(*) FROM msg') AS t1(cc int);