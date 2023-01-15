local z = ...

return function(c,p,u)
	package.loaded[z] = nil
	z = nil
	p = nil
	if u > 1 then
		require("rs")(c, 401)
		return
	end
	collectgarbage()
	local d = {}
	d.f = file.list()
	d.ir,d.iu,d.it = file.fsinfo()
	require("sendJson")(c,d)
end
