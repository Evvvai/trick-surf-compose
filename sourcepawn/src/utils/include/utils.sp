// Utils
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

public void teleport_to_start_zone(client){
	int index = -1;
	float min_dist = 0.0;
	float dist = 0.0;
	float posTR[3] = 0.0;
	float angTR[3] = 0.0;
	float EndOriginTR[3];
	float EndOriginTRArray[3];
	float EndOriginTRResult[3];

	GetClientEyePosition(client, posTR);
	GetClientEyeAngles(client, angTR);
	posTR[2] += 25;
	Handle TraceRay = TR_TraceRayEx(posTR, angTR, 33570827, RayType:1);
	TR_GetEndPosition(EndOriginTR, TraceRay);

	int size = g_triggers.Length;

	
	char xyz[16];
	char zoneName[16];

	for (int i = 0; i < size; i += 4) 
	{
		g_triggers.GetString(i, zoneName, sizeof(zoneName))
		 
		g_triggers.GetString(i+1, xyz, sizeof(xyz))
		EndOriginTRArray[0] = StringToFloat(xyz);

		g_triggers.GetString(i+2, xyz, sizeof(xyz))
		EndOriginTRArray[1] = StringToFloat(xyz);
	
		g_triggers.GetString(i+3, xyz, sizeof(xyz))
		EndOriginTRArray[2] = StringToFloat(xyz);

		float x = EndOriginTRArray[0] - EndOriginTR[0];
		float y = EndOriginTRArray[1] - EndOriginTR[1];
		float z = EndOriginTRArray[2] - EndOriginTR[2];

		dist = SquareRoot(x * x + y * y + z * z)
		
		if((dist < min_dist || min_dist < 1)){
			min_dist = dist;
			index = i;

			EndOriginTRResult[0] = EndOriginTRArray[0];
			EndOriginTRResult[1] = EndOriginTRArray[1];
			EndOriginTRResult[2] = EndOriginTRArray[2];
		}
	}
	
	if(index != -1){
		char zoneName[32];
		g_triggers.GetString(index, zoneName, sizeof(zoneName))
		PrintToChat(client, " \x07Zone found >> \x03%s", zoneName);

		float vel[3] = 0;
		TeleportEntity(client, EndOriginTRResult, NULL_VECTOR, vel);
		}else{
			PrintToChat(client, " \x07Start zone note found");
	}

}

public void reset_cl_vars(int client) {
	// client
	cl_steamid64[client] 		= NULL_STRING; 
	cl_steamid2[client] 		= NULL_STRING; 
	cl_name[client] 			= NULL_STRING; 
    cl_skin[client]             = NULL_STRING; 
}

public bool is_valid_client(int client) {
	return (client >= 1 && client <= MaxClients && IsClientConnected(client) && !IsFakeClient(client) && IsClientInGame(client) && !IsClientSourceTV(client));
}