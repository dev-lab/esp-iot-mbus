local z = ...

return function(co,p,u)
	package.loaded[z] = nil
	z = nil
	p = nil
	if u > 1 then
		require("rs")(co, 401)
		return
	end
	local st = true
	local a = nil
	co:on("sent", function(c)
		if a then
			if #a > 1024 then
				c:send(a:sub(1, 1024))
				a = a:sub(1025)
			else
				c:send(a)
				a = nil
			end
		elseif st then
			st = false
			local s = {}
			s.ls = ls or ""
			if wifi.sta.getconfig then
				local s1 = wifi.sta.getconfig()
				if s1 then
					s.ls = s1..", "..s.ls
				end
			end
			s.ip, s.nm, s.gw = wifi.sta.getip()
			s.aip, s.anm, s.agw = wifi.ap.getip()
			s.als = wifi.ap.getmac()
			if wifi.ap.getconfig then
				local s1 = wifi.ap.getconfig()
				if s1 then
					s.als = s1..", "..s.als
				end
			end
			c:send(',"stat":'..cjson.encode(s)..'}')
			s = nil
		else
			c:close()
			c = nil
		end
		collectgarbage()
	end)
	wifi.sta.getap(function (b)
		a = cjson.encode(b)
		b = nil
		require("rs")(co, 200, '{"aps":', "application/json")
	end)
end
