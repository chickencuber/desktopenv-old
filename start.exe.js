if(!FS.exists("/user/desktop/desktop")) FS.addDir("/user/desktop/desktop");
if(!FS.exists("/user/desktop/apps")) FS.addFile("/user/desktop/apps", FS.getFromPath("/bin/desktop/apps"))

