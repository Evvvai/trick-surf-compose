char sql_change_to_zero[]       = "UPDATE time_online_status tos SET tos.status = 0;";
char sql_update_online_status[] = "UPDATE time_online_status tos SET tos.status = %i, tos.timestamp = (SELECT CURRENT_TIMESTAMP()) where tos.player_id = (SELECT p.id FROM players p WHERE p.steamid = '%s');";
char sql_select_time[]          = "SELECT p.nick, time_to_sec(t.`time`) FROM time_online t JOIN players p ON t.player_id = p.id WHERE t.player_id = (SELECT p.id FROM players p WHERE p.steamid = '%s') ORDER BY t.id DESC LIMIT 1;";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

public void fix_time_status(){
	char szQuery[512];
	Format(szQuery, 512, sql_change_to_zero);
	SQL_TQuery(g_db, CallBack, szQuery, DBPrio_High);	
}

public void client_connect_or_disconect(int client, int status)
{
	char szQuery[512];
	Format(szQuery, sizeof(szQuery), sql_update_online_status, status, cl_steamid2[client]);

    SQL_TQuery(g_db, CallBack, szQuery, DBPrio_Low);	
	
    if(status == 0){
        Format(szQuery, 512, sql_select_time, cl_steamid2[client]);
        g_db.Query(SQL_time_played, szQuery, GetClientUserId(client), DBPrio_Low);
    }

}

public void SQL_time_played(Database db, DBResultSet results, const char[] error, int userid)
{	
	if (results.HasResults)
	{
		char szIdk[256];
		char szName[256];
		char szTime[256];
		
		int totalSecs;
		
		int hours;
		int mins;
		int secs;
		
		char hoursChar[512];
		char minsChar[512];
		char secsChar[512];

		while (results.FetchRow())
		{
			results.FetchString(0, szName,256);
			results.FetchString(1, szTime,256);		

			totalSecs = (StringToInt(szTime));

			hours = (totalSecs / 60) / 60;
			mins = (totalSecs - hours*60*60) / 60;
			secs = (totalSecs - (hours*60*60) - (mins*60));
			
			IntToString(hours, hoursChar, sizeof(hoursChar));
			IntToString(mins, minsChar, sizeof(minsChar));
			IntToString(secs, secsChar, sizeof(secsChar));

			if (hours < 10) Format(hoursChar, sizeof(hoursChar), "0%s", hoursChar);
			else Format(hoursChar, sizeof(hoursChar), "%s",hoursChar);
			
			if (mins < 10) Format(minsChar, sizeof(minsChar), "0%s", minsChar);
			else Format(minsChar, sizeof(minsChar), "%s",minsChar);
			
			if (secs < 10) Format(secsChar, sizeof(secsChar), "0%s", secsChar);
			else Format(secsChar, sizeof(secsChar), "%s",secsChar);
			
			Format(szIdk, 512, " \x0CPlayerDisconnect \x02%s \x06| \x03TimePlayed \x04%s\x06:\x04%s\x06:\x04%s", szName, hoursChar, minsChar, secsChar);
		}
	
		PrintToChatAll(szIdk);
	}
}

public void CallBack(Handle owner, Handle hndl, const char[] error, any data) {

}