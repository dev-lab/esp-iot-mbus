local z = ...

return function(c,p,u)
	package.loaded[z] = nil
	z = nil
	if u > 1 then
		require("rs")(c, 401)
		return
	end
	require("respFile")(c, p and p.name, "json")
end
