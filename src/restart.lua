local z = ...

return function(c,p,u)
	package.loaded[z] = nil
	z = nil
	if u > 1 then
		require("rs")(c, 401)
		return
	end
	require("rs")(c, 200, "")
	tmr.create():alarm(1000, 0, function() node.restart() end)
end
