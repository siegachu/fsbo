@echo off
REM FirstDoorKey FSBO Twitter Poster
REM Posts 1 tweet per run. Scheduled 2x daily.

cd /d C:\Users\siega\.claude\projects\new_web_test\fsbo\scripts
C:\Python314\python.exe x_poster.py --count 1 >> x_poster.log 2>&1
