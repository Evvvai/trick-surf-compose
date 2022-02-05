import { MigrationInterface, QueryRunner } from 'typeorm';

export class viewers1642260450697 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `
            CREATE VIEW suggested_tricks_route_viewer AS
            SELECT st.status AS status,
                st.date_modify AS date_modify,
                st.id AS id,
                st.name AS name,
                st.point AS point,
                st.velocity AS velocity,
                st.date_add AS date_add,
                st.author_id AS author_id,
                p.steamid64 AS author_steamid,

            (SELECT p.nick
            FROM players p
            WHERE (p.id = st.author_id)) AS author_nick,

            (SELECT group_concat(str.name separator ',')
            FROM ((suggested_tricks ts
                    JOIN suggested_routes sr on((ts.id = sr.trick_id)))
                    JOIN triggers str on((str.id = sr.trigger_id)))
            WHERE (ts.id = st.id)) AS route_str,

            (SELECT group_concat(str.id separator ',')
            FROM ((suggested_tricks ts
                    JOIN suggested_routes sr on((ts.id = sr.trick_id)))
                    JOIN triggers str on((str.id = sr.trigger_id)))
            WHERE (ts.id = st.id)) AS route_id,

            (SELECT count(sr.id)
            FROM (suggested_tricks ts
                    JOIN suggested_routes sr on((ts.id = sr.trick_id)))
            WHERE (ts.id = st.id)) AS len,
                st.map_id AS map_id
            FROM (suggested_tricks st
                JOIN players p on((p.id = st.author_id)));
        `,
    );

    queryRunner.query(
      `
        CREATE VIEW time_online_trend AS
        SELECT cast(t.time_join AS date) AS d,
            sec_to_time(sum(time_to_sec(t.time))) AS t,
            round(((sum(time_to_sec(t.time)) * 100) /
                        (SELECT round(avg(a.t), 0)
                        FROM
                        (SELECT sum(time_to_sec(t.time)) AS t
                            FROM time_online t
                            GROUP BY cast(t.time_join AS date)) a)),0) AS trend,
            if((
                    (SELECT round(avg(a.t), 0)
                    FROM
                        (SELECT sum(time_to_sec(t.time)) AS t
                        FROM time_online t
                        GROUP BY cast(t.time_join AS date)) a) > sum(time_to_sec(t.time))),'down', 'up') AS trendStatus
        FROM time_online t
        GROUP BY cast(t.time_join AS date)
        ORDER BY d DESC;
        `,
    );

    queryRunner.query(
      `
        CREATE VIEW tricks_route_viewer AS
        SELECT st.id AS id,
            st.name AS name,
            st.point AS point,
            st.velocity AS velocity,
            st.date_add AS date_add,

        (SELECT group_concat(str.name separator ',')
        FROM ((tricks ts
                JOIN routes sr on((ts.id = sr.trick_id)))
                JOIN triggers str on((str.id = sr.trigger_id)))
        WHERE (ts.id = st.id)) AS route_str,

        (SELECT group_concat(str.id separator ',')
        FROM ((tricks ts
                JOIN routes sr on((ts.id = sr.trick_id)))
                JOIN triggers str on((str.id = sr.trigger_id)))
        WHERE (ts.id = st.id)) AS route_id,

        (SELECT count(sr.id)
        FROM (tricks ts
                JOIN routes sr on((ts.id = sr.trick_id)))
        WHERE (ts.id = st.id)) AS len,
            p.steamid64 AS author_steamid,
            p.nick AS author,
            st.map_id AS map_id
        FROM (tricks st
            LEFT JOIN players p on((p.id = st.author_id)));
        `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query('DROP VIEW if EXISTS suggested_tricks_route_viewer;');
    queryRunner.query('DROP VIEW if EXISTS time_online_trend;');
    queryRunner.query('DROP VIEW if EXISTS tricks_route_viewer;');
  }
}
