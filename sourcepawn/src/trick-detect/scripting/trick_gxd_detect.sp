#include <sourcemod>
#include <sdktools>	
#include <cstrike>
#include <sdkhooks>
#include <clientprefs>

#define MAX_PRE_SPEED 405
#define REDUCE_TIME_TOUCH 0.25

#define MAP_COUNT 2
#define MAP_STRAFES 0
#define MAP_SKI 1
// ... more maps

int 		cl_map[MAXPLAYERS + 1];
int 		cl_prestrafe_speed[MAXPLAYERS + 1];
char 		cl_triggers[MAXPLAYERS + 1][4096];
char 		cl_steamid64[MAXPLAYERS + 1][32];
char 		cl_steamid2[MAXPLAYERS + 1][32];
char 		cl_name[MAXPLAYERS+1][MAX_NAME_LENGTH];
int 		cl_prevelocity[MAXPLAYERS + 1];
int 		cl_freez[MAXPLAYERS + 1];

bool 		cl_debug[MAXPLAYERS + 1]; // Debug
bool 		cl_trick_assist[MAXPLAYERS + 1]; 		// Debug
// bool 		cl_trick_assist_hud[MAXPLAYERS + 1]; 	// Debug

int 		cl_global_view[MAXPLAYERS + 1];
int 		cl_complete_sound[MAXPLAYERS + 1];

ArrayList 	cl_time[MAXPLAYERS+1];
ArrayList 	cl_speed[MAXPLAYERS+1];

ArrayList 	cl_speed_time_touch[MAXPLAYERS+1];
ArrayList 	cl_last_speed_time_touch[MAXPLAYERS+1];
int 		cl_max_speed[MAXPLAYERS + 1];

Database 	g_db = null;

ArrayList 	g_tricks[MAP_COUNT]; 
ArrayList 	g_triggers[MAP_COUNT]; 
ArrayList 	g_hop_triggers[MAP_COUNT]; 

enum struct Triggers {
  char name[128];
  float x;
  float y;
  float z;
}

enum struct SpeedTime {
  	char 	trigger[64];
    int 	speed;
    int 	speed_max;
    float 	get_game_time;
}

 // Maps ids
int g_maps[MAP_COUNT] = {
	2,
	1,
};

// Cookie handle
Handle  g_cookie_global_view  	= INVALID_HANDLE;
Handle  g_cookie_complete_sound = INVALID_HANDLE;
Handle  g_cookie_last_map 		= INVALID_HANDLE;

#include "include/db.sp"
#include "include/utils.sp"
#include "include/saveloc.sp"
#include "include/trick_assistant.sp"

// SETUP
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

public void OnPluginStart() {
	
	// DataBase
	db_connect(g_db == null ? true : false);
	
	// HookEntityOutput
	HookEntityOutput("trigger_multiple", "OnStartTouch", 	OnTriggerStartTouch);
	HookEntityOutput("trigger_multiple", "OnEndTouch", 		OnTriggerEndTouch);	
	HookEvent("player_jump", 	PlayerJumpEvent);	
	HookEvent("player_spawn", 	PlayerSpawnEvent);	
	HookEvent("player_death", 	PlayerDeathEvent);
	
	// SaveLoc
	RegConsoleCmd("sm_teleport", 	cmd_teleport);
	RegConsoleCmd("sm_r", 			cmd_teleport);
	RegConsoleCmd("sm_tele", 		cmd_teleport);
	RegConsoleCmd("sm_back", 		cmd_teleport);

	// MapTeleport
	RegConsoleCmd("sm_tp", 			cmd_map_switch);
	RegConsoleCmd("sm_ski2", 		cmd_ski2);
	RegConsoleCmd("sm_strafes", 	cmd_strafes);

	// Debug
	RegConsoleCmd("sm_debug", 		  cmd_debug);
	RegConsoleCmd("sm_update_tricks", cmd_update_tricks);
	RegConsoleCmd("sm_ut", 			  cmd_update_tricks);
	RegConsoleCmd("sm_noclipme", 	  cmd_reset);
	RegConsoleCmd("sm_noclip", 	 	  cmd_reset);
	RegConsoleCmd("sm_trick_assist",  cmd_trick_assist);
	RegConsoleCmd("sm_ta",			  cmd_trick_assist);

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	

	// LoadData
	db_get_tricks();
	db_get_triggers();
	db_get_hop_triggers();

	// Timers
	CreateTimer(0.1, timer_speed_saved, _, TIMER_REPEAT);

	init_cookies();
    for (int i = MaxClients; i > 0; --i) {
        if(is_valid_client(i) && AreClientCookiesCached(i)) {
			OnClientCookiesCached(i);
		}
	}
}

//ACTION
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

public Action timer_speed_saved(Handle t) {
	for (int i = 1; i <= MaxClients; i++) {
		if (is_valid_client(i) && IsPlayerAlive(i)) {
			int Vel_Count[2];
			int vel = get_cl_speed(i);
			
			if(cl_speed[i].Length > 0) {
				cl_speed[i].GetArray(cl_speed[i].Length - 1, Vel_Count, 2);
				
				Vel_Count[0] += vel;
				Vel_Count[1] += 1;	
				
				cl_speed[i].SetArray(cl_speed[i].Length - 1, Vel_Count, 2); //Add vel in last element
			}

			if(vel > cl_max_speed[i]){
				cl_max_speed[i] = vel;
			}
		}
	}
}

public Action cmd_update_tricks(int client, int args){
	db_get_tricks();
	db_get_triggers();
	db_get_hop_triggers();

    return Plugin_Handled;
}

public Action cmd_map_switch(int client, int args) {

	if(!IsPlayerAlive(client)) return Plugin_Continue;

	char arg_map[16];
    GetCmdArg(1, arg_map, sizeof(arg_map));

	teleport_on_map(client, arg_map);

    return Plugin_Continue;
}

public Action cmd_ski2(int client, int args) {
	if(!IsPlayerAlive(client)) return Plugin_Continue;
	teleport_on_map(client, "ski2");
    return Plugin_Continue;
}

public Action cmd_strafes(int client, int args) {
	if(!IsPlayerAlive(client)) return Plugin_Continue;
	teleport_on_map(client, "strafes");
    return Plugin_Continue;
}

public Action cmd_debug(int client, int args){
	if(cl_debug[client] == true) PrintToChat(client, " \x02 Debug deactivated")
	else PrintToChat(client, " \x02 Debug activated")
	cl_debug[client] = !cl_debug[client];

    return Plugin_Handled;
}

public Action cmd_reset(int client, int args){
	reset_trigger_data(client);

    return Plugin_Handled;
}

public Action cmd_trick_assist(int client, int args){
	if(cl_trick_assist[client] == true) PrintToChat(client, " \x02 Trick assist deactivated")
	else PrintToChat(client, " \x02 Trick assist activated")
	cl_trick_assist[client] = !cl_trick_assist[client];

    return Plugin_Handled;
}


// EVENT
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

public void OnTriggerEndTouch(const char[] output, int caller, int activator, float delay) {
	int client = activator; 
	if (!is_valid_client(client) || !IsPlayerAlive(client))
		return;

	char trigger[64];
	GetEntPropString(caller, Prop_Data, "m_iName", trigger, sizeof(trigger));

	if(!trigger_redundancy(client, trigger)) return;

	if((count_triggers(cl_triggers[client]) <= 1)) {

		cl_speed[client].Clear(); 			  //Clear cuz trick started from null trigger
		cl_time[client].Clear();  			  //Clear cuz trick started from null trigger
		cl_speed_time_touch[client].Clear();  //Clear cuz trick started from null trigger
	
		if (get_cl_speed(client) < MAX_PRE_SPEED) 	cl_prevelocity[client] = 0;
		else 										cl_prevelocity[client] = 1;

		add_part_time_and_speed(client); 	  //Save part between triggers intervals
	}

	add_touch_part_time_and_speed(client, trigger);

	if(strlen(cl_triggers[client]) == 0) {
		if (!strlen(cl_triggers[client])) {
		StrCat(cl_triggers[client], sizeof(cl_triggers[]), trigger);
		} else {
			StrCat(cl_triggers[client], sizeof(cl_triggers[]), ",");
			StrCat(cl_triggers[client], sizeof(cl_triggers[]), trigger);
		}
	}

	if(cl_trick_assist[client] && count_triggers(cl_triggers[client]) > 1) trick_assist(0, trigger, client);
}

public void OnTriggerStartTouch(const char[] output, int caller, int activator, float delay) {
	int client = activator; 
	if (!is_valid_client(client) || !IsPlayerAlive(client))
		return;

	char trigger[64];
	GetEntPropString(caller, Prop_Data, "m_iName", trigger, sizeof(trigger));
	if (!strlen(trigger))
		return;

	if(!trigger_redundancy(client, trigger)) return;
	
	if (!strlen(cl_triggers[client])) {
		StrCat(cl_triggers[client], sizeof(cl_triggers[]), trigger);
	} else {
		StrCat(cl_triggers[client], sizeof(cl_triggers[]), ",");
		StrCat(cl_triggers[client], sizeof(cl_triggers[]), trigger);
	}

	add_part_time_and_speed(client);  				//Save part between triggers intervals
	add_touch_part_time_and_speed(client, trigger); //Save start part between triggers touch intervals
	route_checker(client);			  				//Checking if there are any routes

	if(cl_trick_assist[client] && count_triggers(cl_triggers[client]) > 1) trick_assist(1, trigger, client);
}

public Action PlayerJumpEvent(Event event, const char[] name, bool dontBroadcast) {

	int client = GetClientOfUserId(event.GetInt("userid"));
	int count = count_triggers(cl_triggers[client]);

	 if(count < 2) return Plugin_Handled;

	 char trigger[64];
	 int c = FindCharInString(cl_triggers[client], ',', true);
	 strcopy(trigger, sizeof(trigger), cl_triggers[client][c+1]);

	 int size = g_hop_triggers[cl_map[client]].Length;
	 char _name[64];

	 for (int i = 0; i < size; i += 1) {
	 	g_hop_triggers[cl_map[client]].GetString(i, _name, sizeof(_name));
	 	if(StrEqual(trigger, _name)) {
	 		return Plugin_Handled;
	 	}
	 }
	
	 PrintToChat(client, " \x07 Jump during trick...");
	 reset_trigger_data(client);
	
	return Plugin_Handled;
}

public Action PlayerSpawnEvent(Event event, const char[] name, bool dontBroadcast) {
	int client = GetClientOfUserId(event.GetInt("userid"));
	
	return Plugin_Handled;
}

public Action PlayerDeathEvent(Event event, const char[] name, bool dontBroadcast) {
	int client = GetClientOfUserId(event.GetInt("userid"));
	int clientAttacker = GetClientOfUserId(event.GetInt("attacker"));

	if(is_valid_client(client)){
		reset_trigger_data(client);
	}

	return Plugin_Handled;
}

public void OnClientPutInServer(int client) {
	if(!is_valid_client(client)) return;

	cl_time[client] 					= new ArrayList(ByteCountToCells(512));
	cl_speed[client] 					= new ArrayList(ByteCountToCells(512));

	// cl_map[client] 						= MAP_SKI;
	// cl_global_view[client]				= 1;
	// cl_complete_sound[client]			= 1;

	cl_speed_time_touch[client]			= new ArrayList(view_as<int>(sizeof(SpeedTime)));
	cl_last_speed_time_touch[client]	= new ArrayList(view_as<int>(sizeof(SpeedTime)));

	char steamid2[32];
	GetClientAuthId(client, AuthId_Steam2, steamid2, sizeof(steamid2));
	char steamid64[32];
	GetClientAuthId(client, AuthId_SteamID64, steamid64, sizeof(steamid64));
	char nickname[32];
	GetClientName(client, nickname, sizeof(nickname));
		
	StrCat(cl_steamid2[client], sizeof(cl_steamid2[]), steamid2);
	StrCat(cl_steamid64[client], sizeof(cl_steamid64[]), steamid64);
	StrCat(cl_name[client], sizeof(cl_name[]), nickname);
	
	// Need remove in separete plugin
	char szQuery[512];
	Format(szQuery, sizeof(szQuery), sql_updatePlayer, steamid2,  steamid64, nickname);
    SQL_TQuery(g_db, update_player_callback, szQuery, GetClientUserId(client), DBPrio_Low);
}

//ETC
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
public void OnConfigsExecuted() {
	db_connect(g_db == null ? true : false);
}

public void OnClientConnected(int client) {
}

public void OnClientDisconnect(int client) {
	cl_save_cookies(client);
	reset_cl_vars(client);
}

public OnClientCookiesCached(int client) {
	char global_view[4], complete_sound[4], last_map[4];

	GetClientCookie(client, g_cookie_global_view,	 global_view, 		sizeof(global_view));
	GetClientCookie(client, g_cookie_complete_sound, complete_sound, 	sizeof(complete_sound));
	GetClientCookie(client, g_cookie_last_map, 		 last_map, 			sizeof(last_map));
	
    cl_global_view[client] 		= global_view[0] 	== '\0' ? 1 : StringToInt(global_view);
    cl_complete_sound[client] 	= complete_sound[0] == '\0' ? 1 : StringToInt(complete_sound);
    cl_map[client] 				= last_map[0]	    == '\0' ? 1 : StringToInt(last_map);
}