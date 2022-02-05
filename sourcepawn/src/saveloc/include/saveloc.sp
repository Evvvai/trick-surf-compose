int MAX_LOC = 10;

int now_iteration[MAXPLAYERS+1] =  { -1, ... };

ArrayList cl_pos_history[MAXPLAYERS+1];
ArrayList cl_ang_history[MAXPLAYERS+1];
ArrayList cl_vel_history[MAXPLAYERS+1];

float cl_pos_data[MAXPLAYERS+1][3];
float cl_ang_data[MAXPLAYERS+1][3];
float cl_vel_data[MAXPLAYERS+1][3];

// Saveloc
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

public Action cmd_save_loc(client, args){
    save_loc(client);
    PrintToChat(client, " \x07 Saveloc success!");      //notify client
	return Plugin_Handled;
}

public void save_loc(client){
    GetClientAbsOrigin(client, cl_pos_data[client]);    //save position
    GetClientEyeAngles(client, cl_ang_data[client]);    //save angles
    GetClientVelocity(client, cl_vel_data[client]);     //save velocity - internal
    save_loc_cl_data(client);
}

public Action cmd_teleport(int client, int args){
    if(client > 0 && IsPlayerAlive(client)) {
        if(
            (GetVectorDistance(cl_pos_data[client],NULL_VECTOR) > 0.0)
            && 
            (GetVectorDistance(cl_ang_data[client],NULL_VECTOR) > 0.0)
        )
        {
            float vel[3];
            TeleportEntity(client, cl_pos_data[client], cl_ang_data[client], cl_vel_data[client]);
            GetClientVelocity(client,vel);
        }
        else PrintToChat(client, " \x0CNo Saveloc found.");
    }
    else {
		PrintToChat(client,"\x0CMust be alive to Saveloc!");
	}

    return Plugin_Handled;
}

public Action cmd_trigger_list(int client, int args){
    loc_cl_data_switch(client);
    return Plugin_Handled;
}

public void save_loc_cl_data(client){

    if((now_iteration[client] == MAX_LOC - 1))
    {
        --now_iteration[client];
        cl_pos_history[client].Erase(0);
        cl_ang_history[client].Erase(0);
        cl_pos_history[client].Erase(0);
    }
    else
    {
        ++now_iteration[client];
        cl_pos_history[client].Erase(MAX_LOC - 1);
        cl_ang_history[client].Erase(MAX_LOC - 1);
        cl_vel_history[client].Erase(MAX_LOC - 1);
    }
     
    cl_pos_history[client].Resize(MAX_LOC);
    cl_ang_history[client].Resize(MAX_LOC);
    cl_vel_history[client].Resize(MAX_LOC);

    cl_pos_history[client].ShiftUp(now_iteration[client]);
    cl_ang_history[client].ShiftUp(now_iteration[client]);
    cl_vel_history[client].ShiftUp(now_iteration[client]);

    cl_pos_history[client].SetArray(now_iteration[client], cl_pos_data[client],3);
    cl_ang_history[client].SetArray(now_iteration[client], cl_ang_data[client],3);
    cl_vel_history[client].SetArray(now_iteration[client], cl_vel_data[client],3);
}

public void loc_cl_data_switch(int client){

    PrintToConsole(client, "-");
    for(int i = 0; i < cl_pos_history[client].Length; i++) {
        float ps[3];
        cl_pos_history[client].GetArray(i, ps, 3);
        PrintToConsole(client, "I - %i H - %f %f %f  IT - %i", i,ps[0],ps[1],ps[2],now_iteration[client]);
    }

	Menu hMenu = new Menu(loc_cl_data_switch_callback);

	hMenu.SetTitle("SaveLoc");

	hMenu.AddItem("1", "Next");
	hMenu.AddItem("2", "Previous");

	hMenu.Display(client, 120);
}

public void rebase_loc_cl_data(int client){
    
    PrintToConsole(client, "-");
    for(int i = 0; i < cl_pos_history[client].Length; i++) {
        float ps[3];
        cl_pos_history[client].GetArray(i, ps, 3);
        PrintToConsole(client, "I - %i H - %f %f %f  IT - %i", i,ps[0],ps[1],ps[2],now_iteration[client]);
    }

    cl_pos_history[client].GetArray(now_iteration[client], cl_pos_data[client], 3);
    cl_ang_history[client].GetArray(now_iteration[client], cl_ang_data[client], 3);
    cl_vel_history[client].GetArray(now_iteration[client], cl_vel_data[client], 3);

    TeleportEntity(client, cl_pos_data[client], cl_ang_data[client], cl_vel_data[client]);
}

public int loc_cl_data_switch_callback(Menu menu, MenuAction action, int param1, int param2){	

    switch(action)
	{
		case MenuAction_End: delete menu;
		case MenuAction_Select:{
            char sInfo[128];
			menu.GetItem(param2, sInfo, sizeof(sInfo));

            if(StrEqual(sInfo,"1")){
                if(now_iteration[param1] < 9) ++now_iteration[param1];
                else now_iteration[param1] = 0
            }
            else{
                if(now_iteration[param1] > 0) --now_iteration[param1];
                else now_iteration[param1] = 9
            }
            rebase_loc_cl_data(param1);
            loc_cl_data_switch(param1);
        }
    }
}

GetClientVelocity(client, float vel[3]){
	//dig into the entity properties for the client
	vel[0] = GetEntPropFloat(client, Prop_Send, "m_vecVelocity[0]");
	vel[1] = GetEntPropFloat(client, Prop_Send, "m_vecVelocity[1]");
	vel[2] = GetEntPropFloat(client, Prop_Send, "m_vecVelocity[2]");
}