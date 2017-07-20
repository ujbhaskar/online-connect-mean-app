node makeIpAddress.js
@echo off
SET port=4201
FOR /F "tokens=2,3" %%A IN ('ping %computername% -n 1 -4') DO IF "from"== "%%A" set "IP=%%~B"
echo server starting in %IP:~0,-1%:%port%
ng serve --host %IP:~0,-1% --port %port% --live-reload-port 49153
pause