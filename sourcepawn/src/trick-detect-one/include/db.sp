// Database
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

char sql_select_tricks[] 		= "SELECT route_str, id, name, point, velocity FROM tricks_route_viewer where map_id = %i;";
char sql_select_triggers[] 		= "SELECT t.name, t.x, t.y, t.z FROM triggers t where t.map_id = %i;";
char sql_select_hop_triggers[] 	= "SELECT t.name FROM hop_triggers ht JOIN triggers t ON t.id = ht.trigger_id where t.map_id = %i;";
char sql_select_map[] 			= "SELECT if(ISNULL(m.id), m.id, -1) id FROM maps m WHERE m.name LIKE '%s' LIMIT 1;";

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

// store tricks
void db_get_tricks() {
	char query[128];

	g_tricks = new ArrayList(ByteCountToCells(4096));
	g_db.Format(query, sizeof(query), sql_select_tricks, g_map_id);
	g_db.Query(SQL_SelectTricksCB, query, g_map_id);
}

// store triggers
void db_get_triggers() {
	char query[128];

	g_triggers = new ArrayList(ByteCountToCells(4096));
	g_db.Format(query, sizeof(query), sql_select_triggers, g_map_id);
	g_db.Query(SQL_SelectTriggersCB, query, g_map_id);
}

// store hop triggers
void db_get_hop_triggers() {
	char query[128];

	g_hop_triggers = new ArrayList(ByteCountToCells(4096));
	g_db.Format(query, sizeof(query), sql_select_hop_triggers, g_map_id);
	g_db.Query(SQL_SelectHopTriggersCB, query, g_map_id);
}

// store maps on g_map_id
void db_get_map() {
	char query[128];

	g_db.Format(query, sizeof(query), sql_select_map, g_map_name);
	g_db.Query(SQL_SelectMapCB, query);
}

// Callback
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
			g_tricks.PushString(buffer);
		}
	}

	PrintToServer(" @ SQL_SelectTricksCB @ %s took %f seconds, length: %d, blocksize %d bytes", data, GetEngineTime()-start_tick, g_tricks.Length, g_tricks.BlockSize);
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
			g_triggers.PushString(buffer);
		}
	}


	PrintToServer(" @ SQL_SelectTriggersCB @ %s took %f seconds, length: %d, blocksize %d bytes", data, GetEngineTime()-start_tick, g_tricks.Length, g_tricks.BlockSize);
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
			g_hop_triggers.PushString(buffer);
		}
	}


	PrintToServer(" @ SQL_SelectHopTriggersCB @ %s took %f seconds, length: %d, blocksize %d bytes", data, GetEngineTime()-start_tick, g_tricks.Length, g_tricks.BlockSize);
}

public void SQL_SelectMapCB(Handle owner, Handle hndl, const char[] error, any data) {
	if (hndl == null) {
		LogError(" ERROR @ SQL_SelectMapCB() : \n %s \n");
		return;
	}

	if (!SQL_HasResultSet(hndl))
        return;

	float start_tick = GetEngineTime();
	char buffer[4096];

	while (SQL_FetchRow(hndl)) {
		for (int i = 0; i < 1; i++) { // id
			SQL_FetchString(hndl, i, buffer, sizeof(buffer));
			g_map_id = StringToInt(buffer);
		}
	}

	PrintToServer(" @ SQL_SelectMapCB @ map name - %s | %i took %f seconds", g_map_name, data, GetEngineTime() - start_tick);
}


public void insert_trick_callback(Handle owner, Handle hndl, const char[] error, int userid) {

}

public void update_player_callback(Handle owner, Handle hndl, const char[] error, int userid) {

}

public void SQL_empty_CB(Handle owner, Handle hndl, const char[] error, int userid) {

}


