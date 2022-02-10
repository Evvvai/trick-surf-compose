// Database
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

char sql_select_tricks[] 		= "SELECT route_str, id, name, point, velocity FROM tricks_route_viewer where map_id = %i;";
char sql_select_triggers[] 		= "SELECT t.name, t.x, t.y, t.z FROM triggers t where t.map_id = %i;";
char sql_select_hop_triggers[] 	= "SELECT t.name FROM hop_triggers ht JOIN triggers t ON t.id = ht.trigger_id where t.map_id = %i;";

char sql_insert_speed_time[] 	= "INSERT INTO triggers_time_speed_touch(complete_id, trigger_before_id, trigger_id, speed_start, speed_end, speed_before_max, speed_during_max, time_before, time_during) VALUES(%s, (SELECT st.id FROM triggers st WHERE st.name = '%s' AND map_id = %i), (SELECT st.id FROM triggers st WHERE st.name = '%s' AND map_id = %i), %i, %i, %i, %i, %f, %f);";

char sql_updatePlayer[] 		= "CALL `put_player_data`('%s', '%s', '%s');";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// connect to db if we didnt yet
public void db_connect(bool firstload) {
	if (firstload) {
		char error[256];
      
		g_db = SQL_Connect("surfgxds", false, error, sizeof(error));

		if (g_db == null)
			SetFailState(" ERROR @ db_connect() : \n  %s \n", error);

		LogMessage(" SUCCESS db_connect()");
	}
}

// store tricks on our arrays
void db_get_tricks() {
	char query[128];

	for (int i = 0; i < MAP_COUNT /* MAP_COUNT*/; i++) {
		g_tricks[i] = new ArrayList(ByteCountToCells(4096));
		g_db.Format(query, sizeof(query), sql_select_tricks, g_maps[i]);
		g_db.Query(SQL_SelectTricksCB, query, i);
	}
}

// store triggers on our arrays
void db_get_triggers() {
	char query[128];

	for (int i = 0; i < MAP_COUNT /* MAP_COUNT*/; i++) {
		g_triggers[i] = new ArrayList(ByteCountToCells(4096));
		g_db.Format(query, sizeof(query), sql_select_triggers, g_maps[i]);
		g_db.Query(SQL_SelectTriggersCB, query, i);
	}
}

// store hop triggers on our arrays
void db_get_hop_triggers() {
	char query[128];

	for (int i = 0; i < MAP_COUNT /* MAP_COUNT*/; i++) {
		g_hop_triggers[i] = new ArrayList(ByteCountToCells(4096));
		g_db.Format(query, sizeof(query), sql_select_hop_triggers, g_maps[i]);
		g_db.Query(SQL_SelectHopTriggersCB, query, i);
	}
}



public void SQL_SelectTricksCB(Handle owner, Handle hndl, const char[] error, any data) {
	if (hndl == null) {
		LogError(" ERROR @ SQL_SelectTricksCB() : \n %s \n");
		return;
	}

	if (!SQL_HasResultSet(hndl))
        return;

	float start_tick = GetEngineTime();
	char buffer[4096];

	while (SQL_FetchRow(hndl)) {
		for (int i = 0; i < 5; i++) { // route id name points velo
			SQL_FetchString(hndl, i, buffer, sizeof(buffer));
			g_tricks[data].PushString(buffer);
		}
	}

	PrintToServer(" @ SQL_SelectTricksCB @ %s took %f seconds, length: %d, blocksize %d bytes", g_maps[data], GetEngineTime()-start_tick, g_tricks[data].Length, g_tricks[data].BlockSize);
}

public void SQL_SelectTriggersCB(Handle owner, Handle hndl, const char[] error, any data) {
	if (hndl == null) {
		LogError(" ERROR @ SQL_SelectTriggersCB() : \n %s \n");
		return;
	}

	if (!SQL_HasResultSet(hndl))
        return;

	float start_tick = GetEngineTime();
	char buffer[4096];

	while (SQL_FetchRow(hndl)) {
		for (int i = 0; i < 4; i++) { // name x y z
			SQL_FetchString(hndl, i, buffer, sizeof(buffer));
			g_triggers[data].PushString(buffer);
		}
	}


	PrintToServer(" @ SQL_SelectTriggersCB @ %s took %f seconds, length: %d, blocksize %d bytes", g_maps[data], GetEngineTime()-start_tick, g_tricks[data].Length, g_tricks[data].BlockSize);
}

public void SQL_SelectHopTriggersCB(Handle owner, Handle hndl, const char[] error, any data) {
	if (hndl == null) {
		LogError(" ERROR @ SQL_SelectTriggersCB() : \n %s \n");
		return;
	}

	if (!SQL_HasResultSet(hndl))
        return;

	float start_tick = GetEngineTime();
	char buffer[4096];

	while (SQL_FetchRow(hndl)) {
		for (int i = 0; i < 1; i++) { // name
			SQL_FetchString(hndl, i, buffer, sizeof(buffer));
			g_hop_triggers[data].PushString(buffer);
		}
	}


	PrintToServer(" @ SQL_SelectHopTriggersCB @ %s took %f seconds, length: %d, blocksize %d bytes", g_maps[data], GetEngineTime()-start_tick, g_tricks[data].Length, g_tricks[data].BlockSize);
}

public void insert_trick_callback(Handle owner, Handle hndl, const char[] error, int userid) {

}

public void update_player_callback(Handle owner, Handle hndl, const char[] error, int userid) {

}

public void SQL_empty_CB(Handle owner, Handle hndl, const char[] error, int userid) {

}


