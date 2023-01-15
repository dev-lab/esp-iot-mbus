local z = ...

return function(co, p, e)
	package.loaded[z] = nil
	z = nil
	local res = {htm = "text/html", js = "application/javascript", json="application/json"}
	local m = res[e]
	res = nil
	local o = 0
	if m and file.exists(p) then
		co:on("sent", function(c)
			if not p then
				c:close()
				c = nil
				return
			end
			local f1 = file.open(p)
			f1:seek("set", o)
			local d = f1:read(1024)
			f1:close(); f1 = nil
			if d then
				if #d < 1024 then
					p = nil
				else
					o = o + #d
				end
				c:send(d)
				d = nil
			else
				p = nil
				c:close()
				c = nil
			end
			collectgarbage()
		end)
		require("rs")(co, 200, e == "json" and "" or nil, m)
	else
		require("rs")(co, 404, "Page not found")
	end
end
