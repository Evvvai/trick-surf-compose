teamapps/common/Counter-Strike Global Offensive/csgo/scripts/vscripts/surf/surf.nutfunction boost(x,y,z)
{
	local speed = activator.GetVelocity();
	speed.y += y;
	speed.x += x;
	speed.z += z;
	activator.SetVelocity(speed);
}

function boost_const(x,y,z)
{
	local speed = activator.GetVelocity();
	
	if(x == -1)
	speed.x += x;
	else if(x == 0)
	speed.x = 0;
	else
	speed.x = x;
	
	if(y == -1)
	speed.y += y;
	else if(y == 0)
	speed.y = 0;
	else
	speed.y = y;
	
	if(z == -1)
	speed.z += z;
	else if(z == 0)
	speed.z = 0;
	else
	speed.z = z;
	
	activator.SetVelocity(speed);
}

function boost_any_way(vel_add)
{
	local Vel = activator.GetVelocity();
	local X = Vel.x; 
 	local Y = Vel.y;
	
	if(abs(X)>abs(Y))
	{
		if(X>0)
		{
			Vel.x += vel_add;
		}
		else
		{
			Vel.x -= vel_add;
		}
	}
	else
	{
		if(Y>0)
		{
			Vel.y += vel_add;
		}
		else
		{
			Vel.y -= vel_add;
		}
	}
	

	activator.SetVelocity(Vel);
}

function boost_sky(vel_plus,vel_max)
{
	local Vel = activator.GetVelocity();
	local X = Vel.x; 
 	local Y = Vel.y;
	local speedNow = sqrt(X*X + Y*Y);
	
	if(speedNow>300 && speedNow<vel_max)
	{
		if(abs(X) > abs(Y) && abs(X)-abs(Y) > abs(X)*0.25)
		{
			if(X>0)
			{
				Vel.x += vel_plus;
			}
			else
			{
				Vel.x -= vel_plus;
			}
		}
		else if(abs(Y)-abs(X)>abs(Y)*0.25)
		{
			if(Y>0)
			{
				Vel.y += vel_plus;
			}
			else
			{
				Vel.y -= vel_plus;
			}
		}
	}
	activator.SetVelocity(Vel);
}

function jail(value)
{
	local Vel = activator.GetVelocity();
	local X = Vel.x; 
 	local Y = Vel.y;
	local speedNow = sqrt(X*X + Y*Y);
	
	if(speedNow<1000)
	{
		Vel.y = -800;
		Vel.x = 0;
		Vel.z = 10;
	}
	else if(speedNow<2400)
	{
		Vel.y = -(speedNow*value+400);
		Vel.x = 0;
		Vel.z = 10;
	}
	else
	{
		Vel.y = -(speedNow*value);
		Vel.x = 0;
		Vel.z = 10;
	}
	
	activator.SetVelocity(Vel);
}

function cut_speed(value)
{
	local Vel = activator.GetVelocity();
	local X = Vel.x; 
 	local Y = Vel.y;
	local speedNow = sqrt(X*X + Y*Y);
	
	if(speedNow>3000)
	{
		Vel.x = X*value-0.1;
		Vel.y = Y*value-0.1;
	}
	else
	{