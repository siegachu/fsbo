@echo off
set BAT=C:\Users\siega\.claude\projects\new_web_test\fsbo\scripts\post_daily.bat

schtasks /Delete /TN "FirstDoorKey_Morning" /F 2>nul
schtasks /Delete /TN "FirstDoorKey_Evening" /F 2>nul

schtasks /Create /TN "FirstDoorKey_Morning" /TR "%BAT%" /SC DAILY /ST 08:00 /F
schtasks /Create /TN "FirstDoorKey_Evening" /TR "%BAT%" /SC DAILY /ST 17:00 /F

echo.
echo 2 tasks created (8 AM, 5 PM). Each posts 1 FSBO tweet.
echo Every 5th tweet includes firstdoorkey.com link.
echo.
schtasks /Query /TN "FirstDoorKey_Morning" /FO LIST
schtasks /Query /TN "FirstDoorKey_Evening" /FO LIST
pause
