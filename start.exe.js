if(!FS.exists("/user/desktop/desktop")) FS.addDir("/user/desktop/desktop");
if(!FS.exists("/user/desktop/apps")) FS.addFile("/user/desktop/apps", FS.getFromPath("/bin/desktop/apps"))
if(!FS.exists("/user/desktop/terminal")) FS.addDir("/user/desktop/terminal");
if(!FS.exists("/user/desktop/terminal/.startup.sh")) FS.addFile("/user/desktop/terminal/.startup.sh", FS.getFromPath("/bin/desktop/terminal/.startup.sh"));
