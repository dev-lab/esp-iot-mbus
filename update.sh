#!/bin/bash

ESP_LUA_PYTHON_DIR=~/Proggy/ESP/uploader

python $ESP_LUA_PYTHON_DIR/upload_and_do.py $ESP_LUA_PYTHON_DIR/format.lua
sleep 2
#python $ESP_LUA_PYTHON_DIR/uploader.py $ESP_LUA_PYTHON_DIR/init.lua
#sleep 2
python $ESP_LUA_PYTHON_DIR/upload_and_do.py $ESP_LUA_PYTHON_DIR/restart.lua
sleep 5
for i in ./src/*; do
	python $ESP_LUA_PYTHON_DIR/uploader.py "$i"
done
