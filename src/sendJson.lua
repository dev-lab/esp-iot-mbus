local z = ...

return function(co, d)
	package.loaded[z] = nil
	z = nil
	local e = false
	co:on("sent", function(c)
		if e then
			c:close()
			c = nil
			return
		end
		c:send(cjson.encode(d))
		d = nil
		e = true
		collectgarbage()
	end)
	require("rs")(co, 200, "", "application/json")
end
