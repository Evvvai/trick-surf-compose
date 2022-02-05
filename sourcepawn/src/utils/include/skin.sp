// Skin
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Not implemented
// char sql_select_skin_available[] = "CALL skin_get_available('%s', NULL);";
// char sql_update_skin_settings[] = "CALL skin_update_player_settings('%s', %s);";
// char sql_select_skin_path[] = "SELECT sv.path FROM player_settings_skin pss JOIN skin_variuos sv ON sv.id = pss.skin_variuos_id WHERE pss.player_id = (SELECT p.id FROM players p WHERE p.steamid = '%s');";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
public Action cmd_skin_menu(int client, int args){

    if(args < 1){
        // load_available_skin(client); // Not implemented
        return Plugin_Handled;
    }

    return Plugin_Handled;
}

public void available_skin_menu(int client, ArrayList available){

	Menu hMenu = new Menu(available_skin_callback);

	hMenu.SetTitle("Available skin");

	int size = available.Length;

    for (int i = 0; i < size; i += 2) 
	{
        char id[5];
        char name[32];

		available.GetString(i, id, sizeof(id))
		available.GetString(i + 1, name, sizeof(name))

        char szSkin[128];
        Format(szSkin, 128, " %s ", name);
        
    	hMenu.AddItem(id, szSkin);
	}


	hMenu.Display(client, 120);
}

public int available_skin_callback(Menu menu, MenuAction action, int param1, int param2){	
    switch(action)
	{
		case MenuAction_End: delete menu;
		case MenuAction_Select:{
                char sInfo[256];
                menu.GetItem(param2, sInfo, sizeof(sInfo));

                char szQuery[1024];
	            Format(szQuery, 1024, sql_update_skin_settings, cl_steamid2[param1], sInfo);
                SQL_TQuery(g_db, update_player_callback, szQuery, GetClientUserId(param1), DBPrio_Low);

                get_skin_path(param1);
            }
    }
}

public void update_player_callback(Handle owner, Handle hndl, const char[] error, int userid) {

}

//LoadAvailable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

public void load_available_skin(int client){
    char szQuery[1024];
    Format(szQuery, 1024, sql_select_skin_available, cl_steamid2[client]);
	g_db.Query(load_available_skin_callback, szQuery, GetClientUserId(client), DBPrio_Low);
}

public void load_available_skin_callback(Database db, DBResultSet results, const char[] error, int userid){	
	int client = GetClientOfUserId(userid);
    ArrayList arr = new ArrayList(ByteCountToCells(4096));
    char szQuery[1024];

	if (results.HasResults)
	{
		while (results.FetchRow())
		{
            results.FetchString(0, szQuery, sizeof(szQuery));
            arr.PushString(szQuery);
            results.FetchString(1, szQuery, sizeof(szQuery));
            arr.PushString(szQuery);
		}
	}
    available_skin_menu(client, arr);
}


//SetSkin
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

public void get_skin_path(int client){
    char szQuery[1024];
    Format(szQuery, 1024, sql_select_skin_path, cl_steamid2[client]);
    g_db.Query(get_skin_path_callback, szQuery, GetClientUserId(client), DBPrio_Low);
}

public void get_skin_path_callback(Database db, DBResultSet results, const char[] error, int userid){	
	int client = GetClientOfUserId(userid);
    char szQuery[1024];

	if (results.HasResults)
	{
		while (results.FetchRow())
		{
            results.FetchString(0, szQuery, sizeof(szQuery));
            Format(cl_skin[client], sizeof(szQuery), szQuery);
		}
	}
    set_skin(client);
}

*/

public void set_skin(int client) {
    if(is_valid_client(client)) {
		SetEntityModel(client, "models/player/custom_player/legacy/tm_professional_crystal.mdl");
		AcceptEntityInput(client, "SetCustomModel");
		SetEntProp(client, Prop_Send, "m_nSkin", 6);
        // if(strlen(cl_skin[client]) != 0 ) {
        //     SetEntityModel(client, cl_skin[client]);
        // } else {
        //     SetEntityModel(client, "models/player/custom_player/legacy/tm_professional_crystal.mdl");
        //     AcceptEntityInput(client, "SetCustomModel");
        //     SetEntProp(client, Prop_Send, "m_nSkin", 6);
        // }
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////


public OnMapStart()	{

    // 0 Crystall
	AddFileToDownloadsTable("models/player/custom_player/legacy/tm_professional_crystal.dx90.vtx");
	AddFileToDownloadsTable("models/player/custom_player/legacy/tm_professional_crystal.mdl");
	AddFileToDownloadsTable("models/player/custom_player/legacy/tm_professional_crystal.phy");
	AddFileToDownloadsTable("models/player/custom_player/legacy/tm_professional_crystal.vvd");
	
	AddFileToDownloadsTable("materials/crystal/cubemap.vtf");
	AddFileToDownloadsTable("materials/crystal/noise.vtf");

	AddFileToDownloadsTable("materials/models/crystal/noise.vtf");

	AddFileToDownloadsTable("materials/models/crystal/player/base.vmt");
	AddFileToDownloadsTable("materials/models/crystal/player/black.vmt");
	AddFileToDownloadsTable("materials/models/crystal/player/blue.vmt");
	AddFileToDownloadsTable("materials/models/crystal/player/green.vmt");
	AddFileToDownloadsTable("materials/models/crystal/player/base.vmt");
	AddFileToDownloadsTable("materials/models/crystal/player/nooutline.vmt");
	AddFileToDownloadsTable("materials/models/crystal/player/outline.vmt");
	AddFileToDownloadsTable("materials/models/crystal/player/outline_noise.vtf");
	AddFileToDownloadsTable("materials/models/crystal/player/pink.vmt");
	AddFileToDownloadsTable("materials/models/crystal/player/red.vmt");
	AddFileToDownloadsTable("materials/models/crystal/player/shattered.vmt");
	AddFileToDownloadsTable("materials/models/crystal/player/white.vmt");
	AddFileToDownloadsTable("materials/models/crystal/player/yellow.vmt");
	
	PrecacheModel("models/player/custom_player/legacy/tm_professional_crystal.mdl", true);
}