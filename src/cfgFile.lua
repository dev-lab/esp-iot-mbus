local z = ...

local function getCf()
	local c, f = {}, file.open("esp.cfg")
	if f then
		c = cjson.decode(f:read())
		cf[1] = c.aPwd
		cf[2] = c.uPwd
		f:close(); f = nil
	end
	return c
end

local function setCf(c)
	local f = file.open("esp.cfg", "w+")
	if f then
		f:write(cjson.encode(c))
		f:flush()
		f:close(); f = nil
	end
end

return function(p)
	package.loaded[z] = nil
	z = nil
	local c, d = getCf(), {}
	if not p then return c, "", 200 end
	if p.file then d = cjson.decode(p.file) end
	local m = p.m
	p = nil
	collectgarbage()
	if d.old == "" then d.old = p end
	if d.pwd == "" then d.pwd = p end
	local r = ""
	if m == "ap" then
		if d.pwd and #d.pwd < 8 then
			return c, "Password too short", 403
		end
		c.sta = d.opt
		c.ssid = d.ssid
		c.pwd = d.pwd
		tmr.create():alarm(2000, 0, function() node.restart() end)
		r = "Setting AP: "..(c.ssid or "").." ..."
	elseif m == "admin" then
		if d.old ~= c.aPwd then
			return c, "Old password wrong", 403
		end
		c.aPwd = d.pwd
		cf[1] = c.aPwd
		r = "Password changed for admin"
	elseif m == "user" then
		c.uPwd = d.pwd
		cf[2] = c.uPwd
		r = "Password changed for user"
	else
		return c, "Unknown cfg", 403
	end
	d = p
	m = p
	collectgarbage()
	setCf(c)
	return c, r, 200
end
