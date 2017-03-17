# Errors

## PortAlreadyUsed

This happens when you try to launch `server` in a port that is already being used by another process. It can be another server process or a totally independent process. To fix it you can do:

- Change the port for the server such as `server({ port: 5000 });`
- Find out what process is already using the port and stop it.
