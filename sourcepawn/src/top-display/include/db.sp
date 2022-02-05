// Database
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

char sql_top[]         = "CALL top_avg_global('%s',11)";

// connect to db if we didnt yet
public void db_connect(bool firstload) {
	if (firstload) {
		char error[256];
      
		g_db = SQL_Connect("trick_gxd", false, error, sizeof(error));

		if (g_db == null)
			SetFailState(" ERROR @ db_connect() : \n  %s \n", error);

		LogMessage(" SUCCESS TRICK GXD TOP DIPLAY db_connect()");
	}
}
