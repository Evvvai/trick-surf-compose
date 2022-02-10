import { MigrationInterface, QueryRunner } from 'typeorm';

export class workers1643030004882 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `
            CREATE EVENT worker_leaderboard_cached
            ON SCHEDULE
                EVERY 15 MINUTE STARTS (SELECT DATE_ADD(NOW(), INTERVAL 1 MINUTE))
            ON COMPLETION PRESERVE
            ENABLE
            COMMENT ''
            
            DO BEGIN

                CALL put_leaderboard_cached();

            END; 
          `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query('DROP EVENT if EXISTS worker_leaderboard_cached;');
  }
}
