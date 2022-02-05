// Information Menu
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

public Action cmd_information_menu(int client, int args){
    information_menu(client);

    return Plugin_Handled;
}

public void information_menu(int client){

	Menu hMenu = new Menu(information_menu_callback);

	hMenu.SetTitle("Trick Surf");

	hMenu.AddItem("-1", "www.surfgods.xyz (all server information)");
	hMenu.AddItem("0",  "!disc Discord server");
	hMenu.AddItem("1",  "!tp (ski2/xdr/aero) ");
	// hMenu.AddItem("2",  "!daily / !d - Daily tricks");
	// hMenu.AddItem("-2", "!pack / !p - Tricks pack");
	hMenu.AddItem("3",  "!triggers / !t - Show triggers touch");
	hMenu.AddItem("4",  "!showtriggers / !st - Show world triggers");
	hMenu.AddItem("5",  "!trickmenu / !tm - Trick settings");
	hMenu.AddItem("6",  "!saveloc - Save position");
	hMenu.AddItem("7",  "!teleport - Teleport to saveloc");
	hMenu.AddItem("8",  "!skin - Get skin for achievements");
	hMenu.AddItem("9",  "!noclip (VIP) - Noclip permission");
	hMenu.AddItem("10", "!zone (VIP) - Teleport to start zone");
	hMenu.AddItem("11", " ♥ Support the server !");

	hMenu.Display(client, 120);
}

public int information_menu_callback(Menu menu, MenuAction action, int param1, int param2){	
    switch(action)
	{
		case MenuAction_End: delete menu;
		case MenuAction_Select:{
                char sInfo[256];
                menu.GetItem(param2, sInfo, sizeof(sInfo));

                switch (StringToInt(sInfo)) {
                    case -1: {
                        PrintToChat(param1, " ");
                        PrintToChat(param1, " \x07 -----------------------------------");
                        PrintToChat(param1, " \x06 https://surfgxds.xyz/");
                        PrintToChat(param1, " \x07 -----------------------------------");
                        PrintToChat(param1, " ");

                        information_menu(param1);
                    }
                    case 0: {
                        PrintToChat(param1, " ");
                        PrintToChat(param1, " \x07 -----------------------------------");
                        PrintToChat(param1, " \x06 https://discord.gg/nybZnuAsze");
                        PrintToChat(param1, " \x07 -----------------------------------");
                        PrintToChat(param1, " ");

                        information_menu(param1);
                    }
                    case 1: {
                      
                        
                        information_menu(param1);
                    }
                    case 2: {
						
                        information_menu(param1);
                    }
                    case -2: {
                 
                        information_menu(param1);
                    }
                    case 3:{
                
                        information_menu(param1);
                    }
                    case 4:{

                        information_menu(param1);
                    }
                    case 5:{

                        information_menu(param1);
                    }
                    case 6:{

                        information_menu(param1);
                    }
                    case 7:{

                        information_menu(param1);
                    }
                    case 8:{

                        information_menu(param1);
                    }
                    case 9:{
                        PrintToChat(param1, " \x02 PAY TO WIN!");
                        
                        information_menu(param1);
                    }
                    case 10:{
                        PrintToChat(param1, " \x02 PAY TO WIN!");
                        
                        information_menu(param1);
                    }
                    case 11:{
                        PrintToChat(param1, " ");
                        PrintToChat(param1, " \x07 ----------------------------------------------------");
                        PrintToChat(param1, "  \x03 PayPal >> \x06 paypal.com/paypalme/injurka");
                        PrintToChat(param1, "  \x03 Qiwi >> \x06 +79962194314");
                        PrintToChat(param1, " \x07 ----------------------------------------------------");
                        PrintToChat(param1, " ");

                        PrintToConsole(param1, " ");
                        PrintToConsole(param1, "----------------------------------------------------");
                        PrintToConsole(param1, " PayPal >> paypal.com/paypalme/injurka");
                        PrintToConsole(param1, " Qiwi >> +79962194314");
                        PrintToConsole(param1, "----------------------------------------------------");
                        PrintToConsole(param1, " ");

                        information_menu(param1);
                    }
                }
            }
    }
}