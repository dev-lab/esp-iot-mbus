#!/bin/bash

# 1. Determine flash memory size:
esptool --port /dev/ttyUSB0 flash_id
