local z = ...

return function(co,p,u)
	package.loaded[z] = nil
	z = nil
	if u > 1 then
		require("rs")(co, 401)
		return
	end
	if p and p.name then
		file.remove(p.name)
		require("rs")(co, 200, "")
	else
		require("rs")(co, 403, "File to delete not specified")
	end
end
