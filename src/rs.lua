local z = ...

local function rH(r, t, m, h)
	return "HTTP/1.1 "..r.."\r\nServer: devlab (nodemcu)\r\nContent-Type: "..(m or "text/html")..(h or '')..
		"\r\nConnection: close\r\nCache-Control: private, max-age="..(t and ("0, no-cache, no-store\r\n\r\n"..t) or "3628800\r\n\r\n")
end

return function(c, e, t, m)
	package.loaded[z] = nil
	z = nil
	if e == 200 then
		c:send(rH("200 OK", t, m))
	elseif e == 401 then
		c:send(rH("401 Unauthorized", "", nil, "\r\nWWW-Authenticate: Basic realm=\"esp-devlab\""))
	elseif e == 404 then
		c:send(rH("404 Not Found", t or ""))
	else
		c:send(rH("403 Forbidden", t or ""))
	end
end
