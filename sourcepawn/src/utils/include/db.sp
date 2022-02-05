// Database
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

char sql_select_triggers[] 		= "SELECT name, x, y, z FROM triggers;";

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


// store triggers on our arrays
void db_get_triggers() {
	char query[128];

	g_triggers = new ArrayList(ByteCountToCells(4096));
	g_db.Format(query, sizeof(query), sql_select_triggers);
	g_db.Query(SQL_SelectTriggersCB, query);
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


	PrintToServer(" @ surfgxds_information_menu SQL_SelectTriggersCB took %f seconds, length: %d, blocksize %d bytes", GetEngineTime()-start_tick, g_triggers.Length, g_triggers.BlockSize);
}
