local z = ...

local i = 0

local function setAP(a, f)
	local n = {ip = "192.168.4.1", netmask = "255.255.255.0", gateway = "192.168.4.1"}
	wifi.ap.config(a)
	wifi.ap.setip(n)
	a = nil
	n = nil
	f()
end

local function chk(m, a, f, t)
	i = i + 1
	local s = wifi.sta.status()
	if i >= 30 then s = 42 end
	local e = {[2]="Wrong password",[3]="No wireless network found",[4]="Connect fail",[42]="Connect timeout"}
	ls = e[s]
	e = nil
	if s == 5 or ls then
		t:unregister()
		if s ~= 5 and m == wifi.STATION then
			wifi.setmode(wifi.STATIONAP)
			setAP(a, f)
		else
			f()
		end
	end
end

return function(f)
	package.loaded[z] = nil
	z = nil
	local c = require("cfgFile")()
	local m = c.sta and wifi.STATION or wifi.STATIONAP
	local a = {}
	a.ssid = c.ssid or "esp-devlab-setup"
	a.pwd = c.pwd or "We1c0me!"
	c = nil
	wifi.setmode(m)
	wifi.sta.autoconnect(1)
	if m == wifi.STATION then
		tmr.create():alarm(1000, 1, function(t) chk(m, a, f, t) end)
	else
		setAP(a, f)
	end
end
