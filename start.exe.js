if(!FS.exists("/user/desktop-old/desktop")) FS.addDir("/user/desktop-old/desktop")
if(!FS.exists("/user/desktop-old/apps")) FS.addFile("/user/desktop-old/apps", FS.getFromPath("/bin/desktop-old/apps"))
if(!FS.exists("/user/desktop-old/terminal")) FS.addDir("/user/desktop-old/terminal");
if(!FS.exists("/user/desktop-old/terminal/.startup.sh")) FS.addFile("/user/desktop-old/terminal/.startup.sh", FS.getFromPath("/bin/desktop-old/terminal/.startup.sh"));
if(!FS.exists("/user/desktop-old/game_best")) FS.addFile("/user/desktop-old/game_best", "0");
