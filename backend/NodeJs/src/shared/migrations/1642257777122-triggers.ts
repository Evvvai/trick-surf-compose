import { MigrationInterface, QueryRunner } from 'typeorm';

export class triggers1642257777122 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      ' CREATE TRIGGER triggers_time_speed_touch_after_insert AFTER INSERT ON triggers_time_speed_touch FOR EACH ROW BEGIN \n' +
        ' 	DECLARE before_route_ids TEXT DEFAULT NULL; \n' +
        ' 	DECLARE last_index INT DEFAULT NULL; \n' +
        ' 	DECLARE last_time FLOAT DEFAULT 0.0; \n' +
        ' 	#DECLARE last_speed INT DEFAULT 0; NOT IMPLEMENTED \n \n' +
        ' 	SELECT sttsr.route_ids INTO before_route_ids \n' +
        ' 	FROM triggers_time_speed_routes sttsr \n' +
        ' 	WHERE sttsr.complete_id = NEW.complete_id \n' +
        ' 	ORDER BY sttsr.route_ids DESC \n' +
        ' 	LIMIT 1; \n \n' +
        ' 	SELECT sttsr.index INTO last_index \n' +
        ' 	FROM triggers_time_speed_routes sttsr \n' +
        ' 	WHERE sttsr.complete_id = NEW.complete_id  \n' +
        ' 	ORDER BY sttsr.route_ids DESC \n' +
        ' 	LIMIT 1; \n \n' +
        ' 	SELECT sttsr.summary_time INTO last_time \n' +
        ' 	FROM triggers_time_speed_routes sttsr \n' +
        ' 	WHERE sttsr.complete_id = NEW.complete_id \n' +
        ' 	ORDER BY sttsr.route_ids DESC \n' +
        ' 	LIMIT 1; \n \n' +
        ' 	#SELECT lc.summary_speed INTO last_speed; NOT IMPLEMENTED \n \n' +
        ' 	INSERT INTO triggers_time_speed_routes(complete_id,`index`,route_ids,summary_time) \n' +
        ' 	VALUES(NEW.complete_id, \n' +
        ' 		   if(last_index IS NULL,0,last_index + 1),  \n' +
        " 		   if(before_route_ids IS NULL,NEW.trigger_id,CONCAT(before_route_ids,',',NEW.trigger_id)), \n" +
        ' 	       last_time + NEW.time_before + NEW.time_during); \n' +
        ' END;',
    );

    queryRunner.query(
      'CREATE TRIGGER completes_after_insert AFTER INSERT ON completes \n' +
        ' FOR EACH ROW \n' +
        ' BEGIN \n \n' +
        ' DECLARE TimeWR FLOAT DEFAULT NULL; \n' +
        ' DECLARE SpeedWR FLOAT DEFAULT NULL; \n \n' +
        ' SELECT sc.time  INTO TimeWR  FROM completes sc WHERE sc.id = (SELECT ts.complete_id FROM twr  AS ts WHERE ts.trick_id = NEW.trick_id); \n' +
        ' SELECT sc.speed INTO SpeedWR FROM completes sc WHERE sc.id = (SELECT ts.complete_id FROM swr AS ts WHERE ts.trick_id = NEW.trick_id); \n \n' +
        ' IF ISNULL(SpeedWR) THEN \n' +
        '        INSERT INTO swr(complete_id, trick_id) VALUES(NEW.id, NEW.trick_id); \n' +
        '        ELSE IF SpeedWR < NEW.speed THEN \n' +
        '        UPDATE swr ss SET ss.complete_id = NEW.id WHERE ss.trick_id = NEW.trick_id; \n' +
        '        END IF; \n' +
        ' END IF; \n \n' +
        ' IF ISNULL(TimeWR) THEN \n' +
        '        INSERT INTO twr(complete_id, trick_id) VALUES(NEW.id, NEW.trick_id); \n' +
        '        ELSE IF TimeWR > NEW.time THEN \n' +
        '        UPDATE twr st SET st.complete_id = NEW.id WHERE st.trick_id = NEW.trick_id; \n' +
        '        END IF; \n' +
        ' END IF; \n \n' +
        ' END; \n',
    );

    queryRunner.query(
      ' CREATE TRIGGER players_after_insert AFTER INSERT ON players \n' +
        ' FOR EACH ROW BEGIN \n' +
        '     INSERT INTO time_online_status(player_id, status) \n' +
        '     VALUES(NEW.id, 1); \n' +
        ' END; \n',
    );

    queryRunner.query(
      ' CREATE TRIGGER suggested_tricks_after_update AFTER UPDATE ON suggested_tricks  \n' +
        ' FOR EACH ROW BEGIN \n' +
        ' 	#CASE NEW.status	 \n' +
        " 		#WHEN 'accepted' THEN CALL post_accepted_suggested_trick(NEW.id); \n" +
        " 		#WHEN 'declined' \n" +
        " 		#WHEN 'pending' \n" +
        ' 	#END CASE; \n' +
        ' END;',
    );

    queryRunner.query(
      ' CREATE TRIGGER swr_after_update AFTER UPDATE ON swr  \n' +
        ' FOR EACH ROW BEGIN \n' +
        '   INSERT INTO swr_update(now_wr, before_wr)  \n' +
        ' 	 VALUES(NEW.complete_id,  \n' +
        ' 				(SELECT sc.id  \n' +
        ' 				 FROM completes sc  \n' +
        ' 				 WHERE sc.trick_id = NEW.trick_id \n' +
        ' 				 AND \n' +
        ' 				 sc.speed  \n' +
        ' 				 <  \n' +
        ' 				 (SELECT sc1.speed  \n' +
        ' 				  FROM completes sc1  \n' +
        ' 				  WHERE sc1.id = NEW.complete_id)  \n' +
        ' 				  ORDER BY sc.speed DESC LIMIT 1)); \n' +
        ' END;',
    );

    queryRunner.query(
      ' CREATE TRIGGER swr_update_after_delete AFTER DELETE ON swr_update FOR EACH ROW BEGIN \n' +
        ' 	IF ((SELECT wr.trick_id FROM twr wr WHERE wr.trick_id = (SELECT c.trick_id FROM completes c WHERE c.id = OLD.now_wr)) IS NULL) \n' +
        ' 		THEN INSERT INTO twr(trick_id, complete_id) VALUES((SELECT c.trick_id FROM completes c WHERE c.id = OLD.now_wr), OLD.before_wr); \n' +
        ' 	END IF; \n' +
        ' END;',
    );

    queryRunner.query(
      ' CREATE TRIGGER swr_update_before_delete BEFORE DELETE ON swr_update FOR EACH ROW BEGIN \n' +
        ' 	IF ((SELECT c.id FROM completes c WHERE c.id = OLD.before_wr) IS NULL) \n' +
        ' 		THEN INSERT INTO swr_update(now_wr, before_wr) VALUES((SELECT uwr.before_wr FROM swr_update uwr WHERE uwr.now_wr = OLD.before_wr), OLD.now_wr); \n' +
        ' 	END IF; \n' +
        ' END;',
    );

    queryRunner.query(
      ' CREATE TRIGGER time_online_status_before_update BEFORE UPDATE ON time_online_status FOR EACH ROW BEGIN \n' +
        ' 	DECLARE time_stamp TIMESTAMP; \n' +
        ' 	IF (NEW.status = 0) THEN \n' +
        ' 		SELECT tos.timestamp INTO time_stamp \n' +
        ' 		FROM time_online_status AS tos  \n' +
        ' 		WHERE tos.player_id = new.player_id && tos.status = 1  \n' +
        ' 		ORDER BY tos.timestamp DESC  \n' +
        ' 		LIMIT 1; \n \n' +
        ' 		INSERT INTO time_online(player_id,time,time_join,time_left)  \n' +
        ' 		VALUES(new.player_id,SEC_TO_TIME(UNIX_TIMESTAMP(NEW.timestamp) - UNIX_TIMESTAMP(time_stamp)),time_stamp,NEW.timestamp); \n' +
        ' 	END IF; \n' +
        ' END;',
    );

    queryRunner.query(
      ' CREATE TRIGGER twr_after_update AFTER UPDATE ON twr FOR EACH ROW BEGIN \n' +
        ' 	INSERT INTO twr_update(now_wr,before_wr)  \n' +
        ' 	VALUES(NEW.complete_id,  \n' +
        ' 			(SELECT sc.id  \n' +
        ' 			 FROM completes sc  \n' +
        ' 			 WHERE sc.trick_id = NEW.trick_id \n' +
        ' 			 AND \n' +
        ' 			 sc.time \n' +
        ' 			 > \n' +
        ' 			 (SELECT sc1.time  \n' +
        ' 			  FROM completes sc1  \n' +
        ' 			  WHERE sc1.id = NEW.complete_id)  \n' +
        ' 			   ORDER BY sc.time ASC LIMIT 1)); \n' +
        ' END; ',
    );

    queryRunner.query(
      ' CREATE TRIGGER twr_update_after_delete AFTER DELETE ON twr_update FOR EACH ROW BEGIN \n' +
        ' 	IF ((SELECT wr.trick_id FROM twr wr WHERE wr.trick_id = (SELECT c.trick_id FROM completes c WHERE c.id = OLD.now_wr)) IS NULL) \n' +
        ' 		THEN INSERT INTO twr(trick_id, complete_id) VALUES((SELECT c.trick_id FROM completes c WHERE c.id = OLD.now_wr), OLD.before_wr); \n' +
        ' 	END IF; \n' +
        ' END; ',
    );

    queryRunner.query(
      ' CREATE TRIGGER twr_update_before_delete BEFORE DELETE ON twr_update FOR EACH ROW BEGIN \n' +
        ' 		IF ((SELECT c.id FROM completes c WHERE c.id = OLD.before_wr) IS NULL) \n' +
        ' 			THEN INSERT INTO twr_update(now_wr, before_wr) VALUES((SELECT uwr.before_wr FROM twr_update uwr WHERE uwr.now_wr = OLD.before_wr), OLD.now_wr); \n' +
        ' 		END IF; \n' +
        ' END; ',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query('drop trigger if exists completes_after_insert;');
    queryRunner.query('drop trigger if exists players_after_insert;');
    queryRunner.query('drop trigger if exists suggested_tricks_after_update;');
    queryRunner.query('drop trigger if exists swr_after_update;');
    queryRunner.query('drop trigger if exists swr_update_after_delete;');
    queryRunner.query('drop trigger if exists swr_update_before_delete;');
    queryRunner.query(
      'drop trigger if exists time_online_status_before_update;',
    );
    queryRunner.query(
      'drop trigger if exists triggers_time_speed_touch_after_insert;',
    );
    queryRunner.query('drop trigger if exists twr_after_update;');
    queryRunner.query('drop trigger if exists twr_update_after_delete;');
    queryRunner.query('drop trigger if exists twr_update_before_delete;');
  }
}
