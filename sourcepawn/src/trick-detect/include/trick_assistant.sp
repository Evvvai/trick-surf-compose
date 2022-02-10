// Trick Assistant
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

char sql_trick_complete[] 		= "INSERT INTO completes(player_id, trick_id, time, speed) VALUES((SELECT p.id FROM players p WHERE p.steamid = '%s'), '%s', %s, %s);";
char sql_trick_check_wr[] 		= "SELECT sc.id,round(sc.time, 2) TIME,round(sc1.time, 2) time_wr,(SELECT p.nick FROM players p WHERE p.id = sc1.player_id) twr_nick,sc1.id swr_id,sc.speed,sc2.speed speed_wr,(SELECT p.nick FROM players p WHERE p.id = sc2.player_id) swr_nick, sc2.id twr_id,st.name, st.point FROM completes sc LEFT JOIN twr AS ts ON ts.trick_id = sc.trick_id LEFT JOIN swr AS ss ON ss.trick_id = sc.trick_id LEFT JOIN completes AS sc1 ON sc1.id = ts.complete_id LEFT JOIN completes AS sc2 ON sc2.id = ss.complete_id JOIN tricks st ON st.id = sc.trick_id WHERE sc.player_id = (SELECT p.id FROM players p WHERE p.steamid = '%s') && sc.trick_id = '%s' ORDER BY sc.id DESC LIMIT 1;";
char sql_select_complete_id[]	= "SELECT sc.id FROM completes sc WHERE sc.player_id = (SELECT p.id FROM players p WHERE p.steamid = '%s') AND sc.trick_id = %s ORDER by sc.id DESC LIMIT 1;";

char last_founded_speed_time_route[MAXPLAYERS + 1][4096];
char founded_speed_time_route[] 				= " \x06You \x07/ \x03Best \x07-> \x0CSpeed \x07| \x06%i \x02/ \x03%i \x0CTime \x02| \x06%f \x07/ \x03%f \x0CMaxSpeed \x02| \x06%i \x07/ \x03%i";
char founded_speed_time_route_title[] 			= " \x06You \x06result  \x07/  \x03Best \x03result";

char founded_speed_time_route_speed_up[] 		= " \x0CSpeed 	 \x07| \x06%i \x02/ \x03%i \x06(+%i)";
char founded_speed_time_route_speed_down[] 		= " \x0CSpeed 	 \x07| \x06%i \x02/ \x03%i \x02(%i)";
char founded_speed_time_route_speed[] 			= " \x0CSpeed 	 \x07| \x03%i";

char founded_speed_time_route_time_up[] 		= " \x0CTime 	 \x07| \x06%0.3f \x07/ \x03%0.3f \x06(%0.3f)";
char founded_speed_time_route_time_down[] 		= " \x0CTime 	 \x07| \x06%0.3f \x07/ \x03%0.3f \x02(+%0.3f)";
char founded_speed_time_route_time[] 			= " \x0CTime 	 \x07| \x03%0.3f";

char founded_speed_time_route_maxspeed_up[] 	= " \x0CMaxSpeed \x07| \x06%i \x07/ \x03%i \x06(+%i)";
char founded_speed_time_route_maxspeed_down[] 	= " \x0CMaxSpeed \x07| \x06%i \x07/ \x03%i \x02(%i)";
char founded_speed_time_route_maxspeed[] 		= " \x0CMaxSpeed \x07| \x03%i";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

public void route_checker(int client){ //Check contains tricks

	if(cl_debug[client]) { //Debug
		PrintToConsole(client, " ");
		PrintToConsole(client, "TRIGGERS NOW >> %s", cl_triggers[client]);
		PrintToConsole(client, " ");
	}

	int containTricks = 0;
	int size = g_tricks[cl_map[client]].Length;

	char _route[8096];
	char _trick_name[128];
	char _speed_trick[4];


	for (int i = 0; i < size; i += 5) {
		g_tricks[cl_map[client]].GetString(i, _route, sizeof(_route));
		g_tricks[cl_map[client]].GetString(i+2, _trick_name, sizeof(_trick_name));
		g_tricks[cl_map[client]].GetString(i+4, _speed_trick, sizeof(_speed_trick));

		if(StrContains(_route, cl_triggers[client]) > - 1 && cl_start_type[client] == StringToInt(_speed_trick)) {
			if(cl_debug[client]) PrintToConsole(client, "CONTAIN >> %s | %s", _trick_name, _route); // Debug
			++containTricks;
			if (StrEqual(_route, cl_triggers[client]) == 1) {
                complete_trick(client, i);
			}
		}
	}

	if(cl_debug[client]) { //Debug
		PrintToConsole(client, " ");
		PrintToConsole(client, "TOTAL CONTAIN >> %i", containTricks);
		PrintToChat(client, " \x02TOTAL CONTAIN >> %i", containTricks);
		PrintToConsole(client, " "); 
	}

	if (containTricks == 0 && strlen(cl_triggers[client]) != 0) trim_client_triggers(client);
}

public void trim_client_triggers(int client){ // Trim first trigger in cl_triggers

	set_start_type(client, 1);
	
	if(cl_speed[client].Length > 0) 					cl_speed[client].Erase(0);
	if(cl_time[client].Length > 0) 						cl_time[client].Erase(0);
	if(cl_speed_time_touch[client].Length > 0) 			cl_speed_time_touch[client].Erase(0);

    char buf[1000];
	int c = FindCharInString(cl_triggers[client], ',');
	if (c == -1) {
		reset_trigger_data(client);
		return;
	}
	if(count_triggers(cl_triggers[client]) == 1) cl_is_jump[client] = false;

	strcopy(buf, sizeof(buf), cl_triggers[client][c+1]);
	strcopy(cl_triggers[client], 1000, buf);
	
	int size = g_tricks[cl_map[client]].Length;
	char _route[4096];
	char _speed_trick[4];

	for (int i = 0; i < size; i += 5) {
		g_tricks[cl_map[client]].GetString(i, _route, sizeof(_route));
		g_tricks[cl_map[client]].GetString(i + 4, _speed_trick, sizeof(_speed_trick));

		if(StrContains(_route, cl_triggers[client])>-1) {
			route_checker(client);
			return;
		}
	}
	
	trim_client_triggers(client);
}

public void complete_trick(int client, int trick_index){ //Called then trick complete

    char trick_id[8];
	char trick_time[16];
	char trick_speed[16];

	FloatToString(calculate_time(client),trick_time, sizeof(trick_time));
	IntToString(calculate_speed(client),trick_speed, sizeof(trick_speed));
	if(StringToFloat(trick_time) < 0.1 || StringToInt(trick_speed) < 1) return; // Fix if smth wrong
    g_tricks[cl_map[client]].GetString(trick_index + 1, trick_id, sizeof(trick_id));

	cl_last_speed_time_touch[client] = view_as<int>(cl_speed_time_touch[client].Clone());

	if(cl_complete_sound[client] == 1) {
		ClientCommand(client, "play weapons/flashbang/flashbang_explode1_distant.wav");
		SetEntPropFloat(client, Prop_Send, "m_flHealthShotBoostExpirationTime", GetGameTime() + 1.0);
	}
	
	char szQuery[4096];
	Format(szQuery, sizeof(szQuery), sql_trick_complete, cl_steamid2[client], trick_id, trick_time, trick_speed);
    SQL_TQuery(g_db, insert_trick_callback, szQuery, GetClientUserId(client), DBPrio_High);

	Format(szQuery, sizeof(szQuery), sql_trick_check_wr, cl_steamid2[client], trick_id);
	g_db.Query(check_wr_callback, szQuery, GetClientUserId(client), DBPrio_Low);
	
	Format(szQuery, sizeof(szQuery), sql_select_complete_id, cl_steamid2[client], trick_id);
	g_db.Query(select_trick_touch_callback, szQuery, GetClientUserId(client), DBPrio_Normal);
}

public void select_trick_touch_callback(Database db, DBResultSet results, const char[] error, int userid){	

	int client = GetClientOfUserId(userid);

	char szQuery[1096];
	if (results.HasResults) {
		char _id[256];

		while (results.FetchRow()) {
			results.FetchString(0, _id, 256);
		}

		save_speed_time_during_trick(client, cl_last_speed_time_touch[client], _id);
	}
}

public void check_wr_callback(Database db, DBResultSet results, const char[] error, int userid){	
	int client = GetClientOfUserId(userid);

	if (results.HasResults) {
		char _time_message[512];
		char _speed_message[512];
		char _complete_message[512];

		char _id[256];
		char _time[256];
		char _speed[256];

		char _time_id_wr[256];
		char _time_nick_wr[256];
		char _time_wr[256];

		char _speed_id_wr[256];
		char _speed_nick_wr[256];
		char _speed_wr[256];

		char _trick_name[256];
		char _trick_points[256];


		while (results.FetchRow()) {
			results.FetchString(0,  _id,			256);
			results.FetchString(1,  _time,			256);
			results.FetchString(2,  _time_wr,		256);
			results.FetchString(3,  _time_nick_wr,	256);
			results.FetchString(4,  _time_id_wr,	256);
			results.FetchString(5,  _speed,			256);
			results.FetchString(6,  _speed_wr,		256);
			results.FetchString(7,  _speed_nick_wr,	256);
			results.FetchString(8,  _speed_id_wr,	256);
			results.FetchString(9,  _trick_name,	256);
			results.FetchString(10, _trick_points,	256);
		}

    	Format(_complete_message, 512, 	" \x02Trick   \x07| \x0Cby \x0C%s \x06| Trick \x06 %s \x02| Points \x02 %s", cl_name[client], _trick_name, _trick_points);
		Format(_time_message,  512, 	" \x02Time \x07| \x06 %s \x07WR \x03 %s \x0Cby \x0C %s",_time, _time_wr, _time_nick_wr);
		Format(_speed_message, 512, 	" \x02Спид \x07| \x06 %s \x07WR \x03 %s \x0Cby \x0C %s",_speed, _speed_wr, _speed_nick_wr);

		for (int i = 1; i < MaxClients+1; ++i) {
			if (IsClientInGame(i) && (cl_global_view[i] == 1 || i == client)) {
				PrintToChat(i, _complete_message);
			}
		}

		if(StrEqual(_id, _time_id_wr)) {
			PrintToChatAll(" \x02 New time record \x02| \x03 %s \x0Cby \x0C %s",_time, _time_nick_wr);
			wr_beat_music();
		}
		else  {
			for (int i = 1; i < MaxClients+1; ++i) {
				if (IsClientInGame(i) && (cl_global_view[i] == 1 || cl_global_view[i] == client)) {
					PrintToChat(i, _time_message);
				}
			}
		}
		if(StrEqual(_id, _speed_id_wr)) {
			PrintToChatAll(" \x02 New speed record \x02| \x03 %s \x0Cby \x0C %s",_speed, _speed_nick_wr);
			wr_beat_music();
		}
		else {
			for (int i = 1; i < MaxClients+1; ++i) {
				if (IsClientInGame(i) && (cl_global_view[i] == 1 || cl_global_view[i] == client)) {
					PrintToChat(i, _speed_message);
				}
			}
		}

		for (int i = 1; i < MaxClients+1; ++i) {
			if (IsClientInGame(i) && (cl_global_view[i] == 1 || cl_global_view[i] == client)) {
				PrintToChat(i," ");
			}
		}
	}
}

public void wr_beat_music(){
	int randomnum = GetRandomInt(0, 5);
	char Music[256];
	
	switch(randomnum) {
		case 0: Format(Music, 256, 	"play ambient/ambience/rainscapes/thunder_close01.wav");
		case 1: Format(Music, 256, 	"play ambient/ambience/rainscapes/thunder_close01.wav");
		case 2: Format(Music, 256, 	"play ambient/ambience/rainscapes/thunder_close01.wav");
		case 3: Format(Music, 256, 	"play ambient/ambience/rainscapes/thunder_close01.wav");
		case 4: Format(Music, 256, 	"play ambient/ambience/rainscapes/thunder_close01.wav");
		case 5: Format(Music, 256, 	"play ambient/ambience/rainscapes/thunder_close01.wav");
	}
	
	
	for (new i = 1; i <= MaxClients; i++) {
		if (IsClientInGame(i)) {
			ClientCommand(i, "playgamesound Music.StopAllMusic");
			ClientCommand(i, Music);
		}
	}
}


public void trick_assist(bool type, char[] trigger, int client) { // 0 - end 1 - start
	if(cl_speed_time_touch[client].Length < 2) return;

	char szQuerySpeed[1024];
	char szQueryTime[1024];
	char szQueryMaxSpeed[1024];

	SpeedTime st;
	SpeedTime st_before;
	// SpeedTimeRoute str; 	// Not implemented
	// int speed_dif;		// Not implemented
	// float time_dif;		// Not implemented
	// int speed_max_dif;	// Not implemented

	cl_speed_time_touch[client].GetArray(cl_speed_time_touch[client].Length - 1, st, sizeof st);
	cl_speed_time_touch[client].GetArray(cl_speed_time_touch[client].Length - 2, st_before, sizeof st_before);

	Format(szQuerySpeed, 1024, founded_speed_time_route_speed,
			st.speed);

	Format(szQueryTime, 1024, founded_speed_time_route_time,
			st.get_game_time - st_before.get_game_time); 

	Format(szQueryMaxSpeed, 1024, founded_speed_time_route_maxspeed,
			st.speed_max);

	PrintToChat(client, " ");
	PrintToChat(client, type == 0 ? " \x0CEnd touch | \x03%s" : " \x0CStart touch | \x03%s", trigger);
	PrintToChat(client, szQuerySpeed);
	PrintToChat(client, szQueryTime);
	PrintToChat(client, szQueryMaxSpeed);


	PrintToConsole(client, " ");
	PrintToConsole(client, type == 0 ? " \x0CEnd touch | \x03%s" : " \x0CStart touch | \x03%s", trigger);
	PrintToConsole(client, szQuerySpeed);
	PrintToConsole(client, szQueryTime);
	PrintToConsole(client, szQueryMaxSpeed);
}
