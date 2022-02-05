#include <sourcemod>
#include <sdktools>	
#include <cstrike>
#include <sdkhooks>

#include "include/show_triggers.sp"

public void OnPluginStart() {

	// HookEntityOutput
	HookEntityOutput("trigger_multiple", "OnStartTouch", 	OnTriggerStartTouch);
	
	g_Offset_m_fEffects = FindSendPropInfo("CBaseEntity", "m_fEffects");
	if (g_Offset_m_fEffects == -1) SetFailState("[Show Triggers] Could not find CBaseEntity:m_fEffects");
	
	RegConsoleCmd("sm_st", cmd_show_triggers, "Command to dynamically toggle trigger visibility");
	RegConsoleCmd("sm_showtriggers", cmd_show_triggers, "Command to dynamically toggle trigger visibility");

	RegConsoleCmd("sm_t", cmd_show_trigger_name, "Show name trigger to client");
	RegConsoleCmd("sm_triggers", cmd_show_trigger_name, "Show name trigger to client");
}

// EVENT
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

public void OnTriggerStartTouch(const char[] output, int caller, int activator, float delay) {
	int client = activator; 
	if (!IsPlayerAlive(client)) return;

	char trigger[64];
	GetEntPropString(caller, Prop_Data, "m_iName", trigger, sizeof(trigger));
	if (!strlen(trigger))
		return;

	if(cl_triggers_show[client]) PrintToChat(client, " \x03 %s", trigger);
}

public void OnClientDisconnect(int client) {
	cl_triggers_show[client] = 0;
}