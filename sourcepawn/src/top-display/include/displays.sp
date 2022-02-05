/**
 *
 * Not fully implemented, currently only works for one map (ski2)
 *
 */

// Top Displays
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
ArrayList ArrayTopAVG;

public void top_update(){
	
    char sBuffer[100];
	char sName[5];
	int lastEdictInUse = GetEntityCount();
	
	for (int entity = MaxClients+1; entity <= lastEdictInUse; ++entity) {
		if ( !IsValidEdict(entity) )
			continue;
		
		GetEdictClassname(entity, sBuffer, sizeof(sBuffer));
		if (!StrEqual(sBuffer, "point_worldtext")) continue;
		
		GetEntPropString(entity, Prop_Data, "m_iName", sBuffer, sizeof(sBuffer)); 
		
		strcopy(sName, sizeof(sName), sBuffer);
		char buf[128];
    	char ArrayStr[12];
		
		if(StrEqual(sName, "gs_n")) {
			strcopy(buf, sizeof(buf), sBuffer[8]);
			int i = StringToInt(buf);
			
			if(i > 0) {
				ArrayTopAVG.GetString((i-1) * 5,ArrayStr,sizeof(ArrayStr));
				DispatchKeyValue(entity, "Message", ArrayStr);
			}
		}
		else if(StrEqual(sName, "gs_s")) {
			strcopy(buf, sizeof(buf), sBuffer[9]);
			int i = StringToInt(buf);
			
			if(i > 0)  {
				ArrayTopAVG.GetString(((i-1) * 5)+1,ArrayStr,sizeof(ArrayStr));
				DispatchKeyValue(entity, "Message", ArrayStr);
			}
		}
		else if(StrEqual(sName, "gs_c")) {
			strcopy(buf, sizeof(buf), sBuffer[9]);
			int i = StringToInt(buf);
			
			if(i > 0) {
				ArrayTopAVG.GetString(((i-1) * 5)+2,ArrayStr,sizeof(ArrayStr));
				DispatchKeyValue(entity, "Message", ArrayStr);
			}
		}
		else if(StrEqual(sName, "gs_p")) {
			strcopy(buf, sizeof(buf), sBuffer[10]);
			int i = StringToInt(buf);
			
			if(i > 0) {
				ArrayTopAVG.GetString(((i-1) * 5)+3,ArrayStr,sizeof(ArrayStr));
				DispatchKeyValue(entity, "Message", ArrayStr);
			}
		}
		else if(StrEqual(sName, "gs_u")) {
			strcopy(buf, sizeof(buf), sBuffer[11]);
			int i = StringToInt(buf);
						
			if(i > 0) {
				ArrayTopAVG.GetString(((i-1) * 5)+4,ArrayStr,sizeof(ArrayStr));
				DispatchKeyValue(entity, "Message", ArrayStr);
			}
		}
	}
	select_top();
}

//DataBase Get Data
////////////////////////////////////////////////////////////////////////////////////////////////////////////

public void select_top(){
	ArrayTopAVG = new ArrayList(ByteCountToCells(512));
	
	char szQuery[512];
	Format(szQuery, 512, sql_top, g_maps[1]);
	SQL_TQuery(g_db, SQL_select_top, szQuery, DBPrio_Low);
}

public void SQL_select_top(Handle owner, Handle hndl, const char[] error, any data){
	if (hndl == null) {
		LogError("fffff: %s", error);
		return;
	}
	
	if (SQL_HasResultSet(hndl)) {
		char i[1024];
		while (SQL_FetchRow(hndl)) {
			SQL_FetchString(hndl, 3, i,sizeof(i));
			ArrayTopAVG.PushString(i);
    		
			SQL_FetchString(hndl, 4, i,sizeof(i));
			ArrayTopAVG.PushString(i);
			
			SQL_FetchString(hndl, 11, i,sizeof(i));
			ArrayTopAVG.PushString(i);
			
			SQL_FetchString(hndl, 5, i,sizeof(i));
			ArrayTopAVG.PushString(i);

			SQL_FetchString(hndl, 9, i,sizeof(i));
			ArrayTopAVG.PushString(i);
		}
	}
}