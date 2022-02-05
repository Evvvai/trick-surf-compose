// Utils
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

public int get_cl_speed(int client) {
	float vec[3];
	GetEntPropVector(client, Prop_Data, "m_vecVelocity", vec);
	return RoundToNearest(SquareRoot(vec[0] * vec[0] + vec[1] * vec[1]) * GetEntPropFloat(client, Prop_Send, "m_flLaggedMovementValue"));
}

public bool is_valid_client(int client) {
	return (client >= 1 && client <= MaxClients && IsClientConnected(client) && !IsFakeClient(client) && IsClientInGame(client) && !IsClientSourceTV(client));
}

public void reset_cl_vars(int client) {
	//client
	cl_steamid64[client] 		= NULL_STRING; 
	cl_steamid2[client] 		= NULL_STRING; 
	cl_name[client] 			= NULL_STRING; 

	now_iteration[client] 		= -1;

	cl_pos_data[client]			= NULL_VECTOR;
	cl_ang_data[client]			= NULL_VECTOR;
	cl_vel_data[client]			= NULL_VECTOR;

	delete cl_pos_history[client];
	delete cl_ang_history[client];
	delete cl_vel_history[client];
}

public void cl_save_cookies(int client) {
	char pos_x[32], pos_y[32], pos_z[32];
	char ang_x[32], ang_y[32];
	char vel_x[32], vel_y[32], vel_z[32];

	FloatToString(cl_pos_data[client][0], pos_x, sizeof(pos_x));
	FloatToString(cl_pos_data[client][1], pos_y, sizeof(pos_y));
	FloatToString(cl_pos_data[client][2], pos_z, sizeof(pos_z));
	FloatToString(cl_ang_data[client][0], ang_x, sizeof(ang_x));
	FloatToString(cl_ang_data[client][1], ang_y, sizeof(ang_y));
	FloatToString(cl_vel_data[client][0], vel_x, sizeof(vel_x));
	FloatToString(cl_vel_data[client][1], vel_y, sizeof(vel_y));
	FloatToString(cl_vel_data[client][2], vel_z, sizeof(vel_z));
		
	SetClientCookie(client, g_cookie_pos_x, pos_x);
	SetClientCookie(client, g_cookie_pos_y, pos_y);
	SetClientCookie(client, g_cookie_pos_z, pos_z);
	SetClientCookie(client, g_cookie_ang_x, ang_x);
	SetClientCookie(client, g_cookie_ang_y, ang_y);
	SetClientCookie(client, g_cookie_vel_x, vel_x);
	SetClientCookie(client, g_cookie_vel_y, vel_y);
	SetClientCookie(client, g_cookie_vel_z, vel_z);
}

public void init_cookies() {
	g_cookie_pos_x  = RegClientCookie("gxd_pos_x", "cookie for pos x saveloc", CookieAccess_Public);
	g_cookie_pos_y  = RegClientCookie("gxd_pos_y", "cookie for pos y saveloc", CookieAccess_Public);
	g_cookie_pos_z  = RegClientCookie("gxd_pos_z", "cookie for pos z saveloc", CookieAccess_Public);
	g_cookie_ang_x  = RegClientCookie("gxd_ang_x", "cookie for ang x saveloc", CookieAccess_Public);
	g_cookie_ang_y  = RegClientCookie("gxd_ang_y", "cookie for ang y saveloc", CookieAccess_Public);
	g_cookie_vel_x  = RegClientCookie("gxd_vel_x", "cookie for vel x saveloc", CookieAccess_Public);
	g_cookie_vel_y  = RegClientCookie("gxd_vel_y", "cookie for vel y saveloc", CookieAccess_Public);
	g_cookie_vel_z  = RegClientCookie("gxd_vel_z", "cookie for vel z saveloc", CookieAccess_Public);
}