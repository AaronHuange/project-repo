ssh root@175.178.210.102
#ffmpeg -f avfoundation -i ":0" -vcodec libx264 -preset ultrafast -acodec libmp3lame -ar 44100 -ac 1 -f flv rtmp://175.178.210.102:1935/live/room
