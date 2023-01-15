local z = ...

local function save(v, fc)
	if v == nil then
		fc("Nothing")
		return
	end
	if not v.name or not v.file then
		fc("File body missing")
		return
	end
	local p = tonumber(v.pos)
	if p == 0 then p = nil end
	if not p then
		file.remove("-~"..v.name)
	end
	local rm, _, _ = file.fsinfo()
	if (rm - (p and 1 or 500) - 5000) < #v.file then
		fc("Not enough space on disk")
		return
	end
	p = nil
	rm = nil
	collectgarbage()
	tmr.wdclr()
	require("fSaveI")(v, fc)
end

return function(c,v,u)
	package.loaded[z] = nil
	z = nil
	collectgarbage()
	if u > 1 then
		require("rs")(c, 401)
	else
		save(v, function(er)
			if er then
				require("rs")(c, 403, "Not saved: "..er)
			else
				require("rs")(c, 200, "")
			end
		end)
	end
end
