@Echo off

:Start
set ERRORLEVEL= 0

npm run start

if ERRORLEVEL 5 goto :Start
