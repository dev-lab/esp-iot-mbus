#!/bin/bash

ESP_BINS=~/Proggy/ESP/Binaries

# 1. Determine flash memory size:
#esptool --port /dev/ttyUSB0 flash_id

# 2. Erase flash
#esptool --port /dev/ttyUSB0 erase_flash

# 2.1. Erase flash
esptool -p /dev/ttyUSB0 write_flash -fm dout -fs 512KB 0x00000 $ESP_BINS/0x00000.bin 0x10000 $ESP_BINS/0x10000.bin

# The best option for ESP-01
esptool --port /dev/ttyUSB0 write_flash -fs 512KB -fm qio 0x0 $ESP_BINS/nodemcu-1.5.4.1-final-9-modules-2019-04-13-14-23-57-integer.bin

# ESP12E (NodeMCU Dev Kit 1.0)
#esptool --port /dev/ttyUSB0 write_flash --flash_mode dio --flash_size 32m --flash_freq 40m 0x00000 $ESP_BINS/nodemcu-1.5.4.1-final-11-modules-2019-04-13-14-37-05-integer.bin 0x3fc000 $ESP_BINS/new/esp_init_data_default.bin

# Sonoff switch
# Old NodeMCU
#./esptool.py --port /dev/ttyUSB0 write_flash -fs 1MB -fm dout 0x0 $ESP_BINS/nodemcu-1.5.4.1-final-14-modules-2019-01-19-14-15-07-integer.bin
# New NodeMCU
#esptool --port /dev/ttyUSB0 write_flash -fs 1MB -fm dout 0x0 $ESP_BINS/nodemcu-release-19-modules-2021-03-14-13-38-37-integer.bin

