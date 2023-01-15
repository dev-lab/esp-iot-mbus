local z = ...

return function(v, fc)
	package.loaded[z] = nil
	z = nil
	local n = v.name
	local p = tonumber(v.pos)
	if not p then p = 0 end
	local f = v.file
	local fl = tonumber(v.flush)
	if fl == 0 then fl = nil end
	v = nil
	collectgarbage()
	local n1 = "~"..n
	local n2 = "-"..n1
	local f2 = file.open(n2, "a")
	if not f2 then
		fc("Can't open file: "..n2)
		return
	end
	if p ~= nil and p > 0 then
		local cur = f2:seek("end")
		if cur ~= p then
			f2:close(); f2 = nil
			fc("File seek error, pos: "..p..", cur: "..(cur or "nil"))
			return
		end
	end
	local function fc2()
		n1 = nil
		n2 = nil
		n = nil
		f = nil
		collectgarbage()
		fc(nil)
	end
	local function fc1()
		f2:close(); f2 = nil
		if fl then
			tmr.create():alarm(10, 0, function()
				if file.exists(n) then
					file.remove(n1)
					file.rename(n, n1)
				end
				if not file.rename(n2, n) then
					if not file.rename(n2, n) then
						file.rename(n1, n)
						fc("File rename error")
						return
					end
				end
				file.remove(n1)
				fc2()
			end)
		else
			fc2()
		end
	end
	if not f2:write(f) then
		tmr.create():alarm(10, 0, function()
			local cur = f2:seek("set", p)
			if cur ~= p or not f2:write(f) then
				f2:close(); f2 = nil
				fc("File write error, pos: "..p)
			else
				fc1()
			end
		end)
	else
		fc1()
	end
end
