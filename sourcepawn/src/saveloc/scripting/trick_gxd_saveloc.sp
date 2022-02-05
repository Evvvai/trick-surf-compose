#include <sourcemod>
#include <sdktools>	
#include <cstrike>
#include <sdkhooks>
#include <clientprefs>

char 		cl_steamid64[MAXPLAYERS + 1][32];
char 		cl_steamid2[MAXPLAYERS + 1][32];
char 		cl_name[MAXPLAYERS+1][MAX_NAME_LENGTH];
int 		cl_freez[MAXPLAYERS + 1];

// Cookie handle
Handle  g_cookie_pos_x  = INVALID_HANDLE;
Handle  g_cookie_pos_y  = INVALID_HANDLE;
Handle  g_cookie_pos_z  = INVALID_HANDLE;
Handle  g_cookie_ang_x  = INVALID_HANDLE;
Handle  g_cookie_ang_y  = INVALID_HANDLE;
Handle  g_cookie_vel_x  = INVALID_HANDLE;
Handle  g_cookie_vel_y  = INVALID_HANDLE;
Handle  g_cookie_vel_z  = INVALID_HANDLE;

#include "include/saveloc.sp"
#include "include/utils.sp"

public void OnPluginStart() {
	
	//SaveLoc / Teleports
	RegConsoleCmd("sm_ts", 			cmd_trigger_list, "Next / Previous triggers manipulation");
	RegConsoleCmd("sm_teleport", 	cmd_teleport);
	RegConsoleCmd("sm_r", 			cmd_teleport);
	RegConsoleCmd("sm_tele", 		cmd_teleport);
	RegConsoleCmd("sm_back", 		cmd_teleport);
	RegConsoleCmd("sm_startpos", 	cmd_save_loc);
	RegConsoleCmd("sm_saveloc", 	cmd_save_loc);

    init_cookies();
    for (int i = MaxClients; i > 0; --i) {
        if(is_valid_client(i) && AreClientCookiesCached(i)) {
			OnClientCookiesCached(i);
		}
	}
}

//ACTION
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

public void OnClientPutInServer(int client) {
	if(!is_valid_client(client)) return;

	char steamid2[32];
	GetClientAuthId(client, AuthId_Steam2, steamid2, sizeof(steamid2));
	char steamid64[32];
	GetClientAuthId(client, AuthId_SteamID64, steamid64, sizeof(steamid64));
	char nickname[32];
	GetClientName(client, nickname, sizeof(nickname));

	cl_pos_history[client] = new ArrayList(ByteCountToCells(4096));
	cl_ang_history[client] = new ArrayList(ByteCountToCells(4096));
	cl_vel_history[client] = new ArrayList(ByteCountToCells(4096));
		
	StrCat(cl_steamid2[client], sizeof(cl_steamid2[]), steamid2);
	StrCat(cl_steamid64[client], sizeof(cl_steamid64[]), steamid64);
	StrCat(cl_name[client], sizeof(cl_name[]), nickname);
}

//ETC
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

public void OnClientConnected(int client) {
}

public void OnClientDisconnect(int client) {
	cl_save_cookies(client);
	reset_cl_vars(client);
}

public OnClientCookiesCached(int client) {
	char pos_x[32], pos_y[32], pos_z[32];
	char ang_x[32], ang_y[32];
	char vel_x[32], vel_y[32], vel_z[32];

	GetClientCookie(client, g_cookie_pos_x, pos_x, sizeof(pos_x));
	GetClientCookie(client, g_cookie_pos_y, pos_y, sizeof(pos_y));
    GetClientCookie(client, g_cookie_pos_z, pos_z, sizeof(pos_z));
	GetClientCookie(client, g_cookie_ang_x, ang_x, sizeof(ang_x));
	GetClientCookie(client, g_cookie_ang_y, ang_y, sizeof(ang_y));
	GetClientCookie(client, g_cookie_vel_x, vel_x, sizeof(vel_x));
	GetClientCookie(client, g_cookie_vel_y, vel_y, sizeof(vel_y));
    GetClientCookie(client, g_cookie_vel_z, vel_z, sizeof(vel_z));
	
    cl_pos_data[client][0] = pos_x[0] == '\0' ? 0.0 : StringToFloat(pos_x);
    cl_pos_data[client][1] = pos_y[0] == '\0' ? 0.0 : StringToFloat(pos_y);
    cl_pos_data[client][2] = pos_z[0] == '\0' ? 0.0 : StringToFloat(pos_z);

    cl_ang_data[client][0] = ang_x[0] == '\0' ? 0.0 : StringToFloat(ang_x);
    cl_ang_data[client][1] = ang_y[0] == '\0' ? 0.0 : StringToFloat(ang_y);
    cl_ang_data[client][2] = 0.0;

    cl_vel_data[client][0] = vel_x[0] == '\0' ? 0.0 : StringToFloat(vel_x);
    cl_vel_data[client][1] = vel_y[0] == '\0' ? 0.0 : StringToFloat(vel_y);
    cl_vel_data[client][2] = vel_z[0] == '\0' ? 0.0 : StringToFloat(vel_z);
}