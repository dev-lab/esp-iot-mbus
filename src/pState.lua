local z = ...

return function(co,p)
	package.loaded[z] = nil
	z = nil
	p = nil
	local fp = file.open("ports.json")
	local d = cjson.decode(fp:read())
	fp:close(); fp = nil
	require("sendJson")(co,d)
end
