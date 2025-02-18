if(!FS.exists("/user/desktop-old/desktop")) FS.addDir("/user/desktop/desktop")
if(!FS.exists("/user/desktop-old/apps")) FS.addFile("/user/desktop/apps", FS.getFromPath("/bin/desktop/apps"))
if(!FS.exists("/user/desktop-old/terminal")) FS.addDir("/user/desktop/terminal");
if(!FS.exists("/user/desktop-old/terminal/.startup.sh")) FS.addFile("/user/desktop/terminal/.startup.sh", FS.getFromPath("/bin/desktop/terminal/.startup.sh"));
if(!FS.exists("/user/desktop-old/game_best")) FS.addFile("/user/desktop/game_best", "0");
