w = net.createServer(net.TCP, 20)
w:listen(80, function(co)
	co:on("receive", function(c, q)
		local p, e, u, g = require("request")(q)
		q = nil
		if u > 9 then return end
		c:on("sent", function(ci)
			ci:close()
			ci = nil
		end)
		collectgarbage()
		if u > 2 then
			require("rs")(c, 401)
		elseif not e then
			tmr.create():alarm(100, 0, function()
				if not pcall(function() require(p)(c, g, u) end) then
					require("rs")(c, 404)
				end
			end)
		else
			g = nil
			require("respFile")(c, p, e)
		end
	end)
end)
