// Teleports
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

public Action cmd_teleport(int client, int args){
    if(is_valid_client(client) && IsPlayerAlive(client)) {
        // cl_freez[client] = 1;                           // Situative
	    // CreateTimer(0.15, timer_freez_pos, client);     // Situative
        CreateTimer(0.10, timer_strip_trigger, client); // Situative

        reset_trigger_data(client);
    }

    return Plugin_Handled;
}

public Action timer_strip_trigger(Handle timer, int client) {
    cl_triggers[client] = NULL_STRING;
}

public Action timer_freez_pos(Handle t, any client) {
    SetEntityMoveType(client, MOVETYPE_WALK);
    cl_freez[client] = 0;
}