#include <sdkhooks>

int g_Offset_m_fEffects = -1;
bool g_bShowTriggers[MAXPLAYERS+1] =  { false, ... };
int g_iTransmitCount;
bool cl_triggers_show[MAXPLAYERS + 1] =  { false, ... };

#define EF_NODRAW 		32
#define MAX_TRIGGERS 	10

// ACTION
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

public Action cmd_show_trigger_name(int client, int args) {
	if(client>0)
	{
		cl_triggers_show[client] = !cl_triggers_show[client];
		if(cl_triggers_show[client] == true) PrintToChat(client, " \x05Triggers showing");
		else PrintToChat(client, " \x05Triggers hidden");
	}
	else PrintToChat(client," \x02Smth Wrong!");

    return Plugin_Handled;
}

public Action cmd_show_triggers(int client, int args) {
	if (!client) return Plugin_Handled;

	g_bShowTriggers[client] = !g_bShowTriggers[client];
	
	if (g_bShowTriggers[client]) {
		++g_iTransmitCount;
		PrintToChat(client, " \x0CShowing trigger brushes.");
	} else {
		--g_iTransmitCount;
		PrintToChat(client, " \x0CStopped showing trigger brushes.");
	}
	
	transmit_triggers(g_iTransmitCount > 0 );
	return Plugin_Handled;
}

public Action Hook_SetTransmit(int entity, int client) {
	if (!g_bShowTriggers[client])
	{
		// I will not display myself to this client :(
		return Plugin_Handled;
	}
	return Plugin_Continue;
}

// VOID
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

public void OnClientDisconnect_Post(int client) {
	if (g_bShowTriggers[client]) {
		g_bShowTriggers[client] = false;
		--g_iTransmitCount;
		transmit_triggers( g_iTransmitCount > 0 );
	}	
}

public void transmit_triggers(bool transmit) {
	// Hook only once
	static bool s_bHooked = false;
	
	// Have we done this before?
	if (s_bHooked == transmit)
		return;
	
	// Loop through entities
	char sBuffer[8];
	char szBuffer[64];
	int lastEdictInUse = GetEntityCount();
	for (int entity = MaxClients+1; entity <= lastEdictInUse; ++entity) {
		if ( !IsValidEdict(entity) )
			continue;
		
		// Is this entity a trigger?
		GetEdictClassname(entity, sBuffer, sizeof(sBuffer));
		GetEntPropString(entity, Prop_Data, "m_iName", szBuffer, sizeof(szBuffer));
		if (strcmp(sBuffer, "trigger") != 0) continue;

		// if (strlen(arg_flag_trigger[0]) != 0) {
		// 	bool check = false;
		// 	for(int i = 0; i < MAX_TRIGGERS; i++) {
		// 		PrintToServer("TR / %s - %s", arg_flag_trigger[i], szBuffer);
		// 		if(StrEqual(szBuffer, arg_flag_trigger[i])) check = true;
		// 	}
		// 	if(!check) continue;
		// } 
			
		GetEntPropString(entity, Prop_Data, "m_ModelName", sBuffer, 2);
		if (sBuffer[0] != '*') {
			// The entity must have been created by a plugin and assigned some random model.
			// Skipping in order to avoid console spam.
			continue;
		}


		// Get flags
		int effectFlags = GetEntData(entity, g_Offset_m_fEffects);
		int edictFlags = GetEdictFlags(entity);

		// Determine whether to transmit or not
		if (transmit) {
			effectFlags &= ~EF_NODRAW;
			edictFlags &= ~FL_EDICT_DONTSEND;
		} else {
			effectFlags |= EF_NODRAW;
			edictFlags |= FL_EDICT_DONTSEND;
		}
		
		// Apply state changes
		SetEntData(entity, g_Offset_m_fEffects, effectFlags);
		ChangeEdictState(entity, g_Offset_m_fEffects);
		SetEdictFlags(entity, edictFlags);
		
		// Should we hook?
		if (transmit)
			SDKHook(entity, SDKHook_SetTransmit, Hook_SetTransmit);
		else
			SDKUnhook(entity, SDKHook_SetTransmit, Hook_SetTransmit);
	}
	s_bHooked = transmit;
}