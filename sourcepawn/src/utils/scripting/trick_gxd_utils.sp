#include <sourcemod>
#include <sdktools>	
#include <cstrike>
#include <sdkhooks>
#include <clientprefs>

Database 	g_db = null;

ArrayList 	g_triggers; 

char 		cl_steamid64[MAXPLAYERS + 1][32];
char 		cl_steamid2[MAXPLAYERS + 1][32];
char 		cl_name[MAXPLAYERS+1][MAX_NAME_LENGTH];
char 		cl_skin[MAXPLAYERS + 1][4096];

#include "include/information_menu.sp"
#include "include/db.sp"
#include "include/skin.sp"
#include "include/utils.sp"

// SETUP
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
public void OnPluginStart() {
	
	// DataBase
	db_connect(g_db == null ? true : false);
	
	// Admin Commands
	RegAdminCmd("sm_noclipme", 	cmd_noclip, 		ADMFLAG_RESERVATION, "Toggles noclip on yourself");
	// RegAdminCmd("sm_zone", 		cmd_zone_teleport, 	ADMFLAG_RESERVATION, "Teleport to save zone");

	//SkinMenu
	// RegConsoleCmd("sm_s", 		cmd_skin_menu, "SkinMenu");
	// RegConsoleCmd("sm_skin", 	cmd_skin_menu, "SkinMenu");

	// LoadData triggers for zones
	db_get_triggers()

	// Timers
    CreateTimer(1200.0, timer_site,						 _, TIMER_REPEAT);
    CreateTimer(1300.0, timer_site_trick_creator, 		 _, TIMER_REPEAT);
    CreateTimer(1100.0, timer_suggest,					 _, TIMER_REPEAT);
}

//ACTION
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
public Action cmd_noclip(int client, int args){
    if(client<1||!IsClientInGame(client)||!IsPlayerAlive(client)){
            ReplyToCommand(client, "\x04[SM] \x05You need to be alive to use noclip");
            return Plugin_Handled;
    }
    if (GetEntityMoveType(client) != MOVETYPE_NOCLIP){
        SetEntityMoveType(client, MOVETYPE_NOCLIP);
        //ReplyToCommand(client, "\x04[SM] \x05Noclip Enabled");
    }
    else {
        SetEntityMoveType(client, MOVETYPE_WALK);
        //ReplyToCommand(client, "\x04[SM] \x05Noclip Disabled");
    }
    return Plugin_Handled;
}

public Action cmd_zone_teleport(int client, int args){
	char arg[4];
    GetCmdArg(1, arg, sizeof(arg));

	if(StringToInt(arg) == 1)
		teleport_to_start_zone(client);

    return Plugin_Handled;
}

public Action PlayerSpawnEvent(Event event, const char[] name, bool dontBroadcast) {
	int client = GetClientOfUserId(event.GetInt("userid"));

	set_skin(client);	
}

// TIMERS
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
public Action timer_site(Handle t) {
	PrintToChatAll("⛌ Stats and Trick routes | \x07https://surfgxds.xyz/ ");
}

public Action timer_site_trick_creator(Handle t) {
	PrintToChatAll("⛌ Do you want to create your own trick? | \x07https://surfgxds.xyz/trick-editor ");
}

public Action timer_suggest(Handle t) {
	PrintToChatAll("⛌ Want to become a Trick editers or have any suggestion, write discord \x07Evai#2721 ");
}

public Action timer_information_menu(Handle t, any client) {
	if(IsClientInGame(client)) information_menu(client);
}

// EVENTS
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
public void OnConfigsExecuted() {
	db_connect(g_db == null ? true : false);
}

public void OnClientConnected(int client) {
	CreateTimer(10.0, timer_information_menu, client) // Information Menu Show
	//get_skin_path(client);
}


public void OnClientPutInServer(int client) {
	if(!is_valid_client(client)) return;

	cl_skin[client] = NULL_STRING;

	char steamid2[32];
	GetClientAuthId(client, AuthId_Steam2, steamid2, sizeof(steamid2));
	char steamid64[32];
	GetClientAuthId(client, AuthId_SteamID64, steamid64, sizeof(steamid64));
	char nickname[32];
	GetClientName(client, nickname, sizeof(nickname));
		
	StrCat(cl_steamid2[client], 	sizeof(cl_steamid2[]), 	steamid2);
	StrCat(cl_steamid64[client], 	sizeof(cl_steamid64[]), steamid64);
	StrCat(cl_name[client], 		sizeof(cl_name[]), 		nickname);
}

public void OnClientDisconnect(int client) {
	reset_cl_vars(client);
}