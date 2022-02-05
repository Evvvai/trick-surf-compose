import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class WRNotify {
  @Field(() => Int)
  id: number;
}

// CREATE TABLE `twr_lost_notify` (
// 	`id` INT(11) NOT NULL AUTO_INCREMENT,
// 	`wr_id` INT(11) NULL DEFAULT NULL,
// 	`player_id` INT(11) NULL DEFAULT NULL,
// 	`is_checked` TINYINT(4) NULL DEFAULT '0',
// 	PRIMARY KEY (`id`) USING BTREE,
// 	INDEX `player_id` (`player_id`) USING BTREE,
// 	INDEX `wr_id` (`wr_id`) USING BTREE,
// 	CONSTRAINT `FK_lost_twr_players` FOREIGN KEY (`player_id`) REFERENCES `surfgxds`.`players` (`id`) ON UPDATE NO ACTION ON DELETE CASCADE,
// 	CONSTRAINT `FK_lost_twr_update` FOREIGN KEY (`wr_id`) REFERENCES `surfgxds`.`twr_update` (`id`) ON UPDATE NO ACTION ON DELETE CASCADE
// );
