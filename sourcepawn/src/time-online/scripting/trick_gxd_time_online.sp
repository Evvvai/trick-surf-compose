#include <sourcemod>

char 		cl_steamid64[MAXPLAYERS + 1][32];
char 		cl_steamid2[MAXPLAYERS + 1][32];
char 		cl_name[MAXPLAYERS+1][MAX_NAME_LENGTH];

Database 	g_db = null;

#include "include/time_online.sp"
#include "include/db.sp"

// SETUP
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
public void OnPluginStart() {
	// DataBase
	db_connect(g_db == null ? true : false);
	
	//Time Online Fix Then Server Crash Or Change Map
	fix_time_status();
}

// ACTION
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
public void OnClientPutInServer(int client) {
	if(!is_valid_client(client)) return;

	char steamid2[32];
	GetClientAuthId(client, AuthId_Steam2, steamid2, sizeof(steamid2));
	char steamid64[32];
	GetClientAuthId(client, AuthId_SteamID64, steamid64, sizeof(steamid64));
	char nickname[32];
	GetClientName(client, nickname, sizeof(nickname));

	StrCat(cl_steamid2[client], sizeof(cl_steamid2[]), steamid2);
	StrCat(cl_steamid64[client], sizeof(cl_steamid64[]), steamid64);
	StrCat(cl_name[client], sizeof(cl_name[]), nickname);
	
	client_connect_or_disconect(client, 1);
}

public void OnClientDisconnect(int client) {
	client_connect_or_disconect(client, 0);

	cl_steamid64[client] 		= NULL_STRING; 
	cl_steamid2[client] 		= NULL_STRING; 
	cl_name[client] 			= NULL_STRING; 
}

public bool is_valid_client(int client) {
	return (client >= 1 && client <= MaxClients && IsClientConnected(client) && !IsFakeClient(client) && IsClientInGame(client) && !IsClientSourceTV(client));
}