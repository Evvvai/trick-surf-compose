// Utils
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

public int count_triggers(const char[] str) {
    int count = str[0] == '\0' ? 0 : 1;
    int i;
    while(str[i]) {
        if (str[i] == ',')
            count++;
        i++;
    }
	
    return count;
}

public bool trigger_redundancy(int client, char[] trigger){

	char buf[64];

	float _tt_buf[2];
	_tt_buf[0] = 0;
	_tt_buf[1]= GetGameTime();
	
	if(cl_time[client].Length > 0) {
		int c = FindCharInString(cl_triggers[client], ',', true);
		strcopy(buf, sizeof(buf), cl_triggers[client][c+1]);
		
		if(StrEqual(trigger, "trigger_push")) return false;
		if(!StrEqual(buf, trigger))			  return true;

		float _tt[2];
		cl_time[client].GetArray(cl_time[client].Length-1, _tt, 2);
		_tt_buf[0] = _tt_buf[1] - _tt[1];

		if(_tt_buf[0] < REDUCE_TIME_TOUCH) {
			return false;
		}
	}
	
	return true;
}

public void add_part_time_and_speed(int client){

	float _tt_buf[2];
	_tt_buf[0] = 0;
	_tt_buf[1]= GetGameTime();
	
	if(cl_time[client].Length > 0) {
		float _tt[2];
		cl_time[client].GetArray(cl_time[client].Length-1, _tt, 2);
		_tt_buf[0] = _tt_buf[1] - _tt[1];
		cl_time[client].PushArray(_tt_buf, 2);
	}
	else cl_time[client].PushArray(_tt_buf, 2);

	cl_speed[client].PushArray({0, 0}, 2);
}

public void add_touch_part_time_and_speed(int client, char[] trigger){

	SpeedTime st;

	StrCat(st.trigger, sizeof(st.trigger), trigger)
    st.speed 		 	= get_cl_speed(client);
	st.get_game_time	= GetGameTime();
	st.speed_max 		= cl_max_speed[client];

    cl_speed_time_touch[client].PushArray(st, sizeof st);

	cl_max_speed[client] = 0;
}

public float calculate_time(int client){ //Calculate Time during trick

	float Total = 0.0;
	for (int j = 0; j < cl_time[client].Length; ++j) {
  		float _tt[2];
		cl_time[client].GetArray(j, _tt, 2);

		float a = _tt[0];
		Total += a;
  	}


	return Total;
}

public int calculate_speed(int client){ //Calculate AVG Speed during trick

	int Total = 0;

	for (int j = 0; j < cl_speed[client].Length; ++j) {
  		int Vel_Count[2];
		cl_speed[client].GetArray(j, Vel_Count, 2);

		if(Vel_Count[0] > 0 && Vel_Count[1] > 0) Total += Vel_Count[0] / Vel_Count[1];
  	}

	if(cl_speed[client].Length - 1 > 0) Total = Total / (cl_speed[client].Length - 1);

	return Total;
}

public void save_speed_time_during_trick(int client, ArrayList speed_time_touch, char[] complete_id){	

	char szQuery[1096];

    SpeedTime st_before;
    SpeedTime st_now;
    SpeedTime st_next;
	
	if(speed_time_touch.Length == 2){
		speed_time_touch.GetArray(0, st_now, sizeof st_now);
		Format(szQuery, 1096, sql_insert_speed_time, 
													 complete_id,
													 "NULL", 		 g_map_id,
													 st_now.trigger, g_map_id,
													 0, st_now.speed, 
													 0, st_now.speed, 
													 0.0, 0.0);
		SQL_TQuery(g_db, insert_trick_callback, szQuery, GetClientUserId(client), DBPrio_Normal);

		speed_time_touch.GetArray(speed_time_touch.Length - 2, st_before, sizeof st_before);
		speed_time_touch.GetArray(speed_time_touch.Length - 1, st_now, sizeof st_now);

		Format(szQuery, 1096, sql_insert_speed_time,
													 complete_id,
													 st_before.trigger, g_map_id,
													 st_now.trigger, 	g_map_id,
													 st_now.speed, 0, 
													 st_now.speed_max, 0, 
													 st_now.get_game_time - st_before.get_game_time, 0.0);
		SQL_TQuery(g_db, insert_trick_callback, szQuery, GetClientUserId(client), DBPrio_Normal);
	}
	else if(speed_time_touch.Length > 2){
		speed_time_touch.GetArray(0, st_now, sizeof st_now);
		Format(szQuery, 1096, sql_insert_speed_time,
													 complete_id,
													 "NULL",			g_map_id,
													 st_now.trigger,	g_map_id,
													 0, st_now.speed, 
													 0, st_now.speed, 
													 0.0, 0.0);
		SQL_TQuery(g_db, insert_trick_callback, szQuery, GetClientUserId(client), DBPrio_Normal);
		
		
		for (int j = 1; j < speed_time_touch.Length - 1; j += 2) {
			speed_time_touch.GetArray(j - 1, st_before, sizeof st_before);
			speed_time_touch.GetArray(j, st_now, sizeof st_now);
			speed_time_touch.GetArray(j + 1, st_next, sizeof st_next);

			Format(szQuery, 1096, sql_insert_speed_time,
														 complete_id,  
														 st_before.trigger, g_map_id,
														 st_now.trigger, 	g_map_id,
														 st_now.speed, st_next.speed, 
														 st_now.speed_max, st_next.speed_max, 
														 st_now.get_game_time - st_before.get_game_time, st_next.get_game_time - st_now.get_game_time);
			SQL_TQuery(g_db, insert_trick_callback, szQuery, GetClientUserId(client), DBPrio_Normal);
		}

		speed_time_touch.GetArray(speed_time_touch.Length - 2, st_before, sizeof st_before);
		speed_time_touch.GetArray(speed_time_touch.Length - 1, st_now, sizeof st_now);

		Format(szQuery, 1096, sql_insert_speed_time,
													 complete_id, 
													 st_before.trigger, g_map_id,
													 st_now.trigger, 	g_map_id,
													 st_now.speed, 0, 
													 st_now.speed_max, 0, 
													 st_now.get_game_time - st_before.get_game_time, 0.0);
		SQL_TQuery(g_db, insert_trick_callback, szQuery, GetClientUserId(client), DBPrio_Normal);
	}
}

public void refresh_start_type(int client) {
	if (cl_prestrafe_speed[client] <= GetConVarInt(g_pre_speed)) {
		set_start_type(client, 0); // pre strafe
		return;
	}

	set_start_type(client, 1); // unlimited
	return;
}

public void set_start_type(int client, int value) {
	cl_start_type[client] = value;

	if(cl_debug[client]) PrintToChat(client, " T - %b | %i | %i - %i", cl_is_jump[client], cl_prestrafe_speed[client], count_triggers(cl_triggers[client]), cl_start_type[client]);
}

public int get_cl_speed(int client) {
	float vec[3];
	GetEntPropVector(client, Prop_Data, "m_vecVelocity", vec);
	return RoundToNearest(SquareRoot(vec[0] * vec[0] + vec[1] * vec[1]) * GetEntPropFloat(client, Prop_Send, "m_flLaggedMovementValue"));
}

public bool is_valid_client(int client) {
	return (client >= 1 && client <= MaxClients && IsClientConnected(client) && !IsFakeClient(client) && IsClientInGame(client) && !IsClientSourceTV(client));
}


public void reset_cl_vars(int client) {
	//client
	cl_triggers[client] 		= NULL_STRING; 
	cl_steamid64[client] 		= NULL_STRING; 
	cl_steamid2[client] 		= NULL_STRING; 
	cl_name[client] 			= NULL_STRING; 
	cl_start_type[client] 		= 0;
	cl_prestrafe_speed[client] 	= 0;
	cl_freez[client] 			= 0;
	cl_max_speed[client] 		= 0;
	cl_trick_assist[client]		= 0;
	cl_is_jump[client]			= false;
	cl_debug[client] 			= false;

	cl_global_view[client]		= 1;
	cl_complete_sound[client]	= 1;
	
	delete cl_time[client];
	delete cl_speed[client];

	delete cl_speed_time_touch[client];
	delete cl_last_speed_time_touch[client];
}

public void reset_trigger_data(int client) {
    cl_triggers[client]      	= NULL_STRING;
    cl_max_speed[client] 	 	= 0;
    cl_prestrafe_speed[client]	= 0;
    cl_is_jump[client]		 	= false;

    cl_speed[client].Clear();
    cl_time[client].Clear();

    cl_speed_time_touch[client].Clear();
    cl_last_speed_time_touch[client].Clear();
}

public void cl_save_cookies(int client) {
	char global_view[4], complete_sound[4];

	IntToString(cl_global_view[client], 	global_view, 	sizeof(global_view));
	IntToString(cl_complete_sound[client], 	complete_sound, sizeof(complete_sound));
		
	SetClientCookie(client, g_cookie_global_view, 		global_view);
	SetClientCookie(client, g_cookie_complete_sound, 	complete_sound);
}

public void init_cookies() {
	g_cookie_global_view    	= RegClientCookie("gxd_global_view",  	"Gxd global view",    	CookieAccess_Public);
    g_cookie_complete_sound  	= RegClientCookie("gxd_complete_sound", "Gxd complete sound",   CookieAccess_Public);
}