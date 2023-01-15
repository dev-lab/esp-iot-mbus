set ESP_LUA_PYTHON_DIR=C:\Proggy\ESP8266\uploader

python %ESP_LUA_PYTHON_DIR%\uploader1_9600.py %ESP_LUA_PYTHON_DIR%\init.lua
%windir%\System32\timeout /t 2
python %ESP_LUA_PYTHON_DIR%\upload_and_do1_9600.py %ESP_LUA_PYTHON_DIR%\restart.lua
%windir%\System32\timeout /t 5
cd src
for %%i in (*) do python %ESP_LUA_PYTHON_DIR%\uploader1.py %%i
