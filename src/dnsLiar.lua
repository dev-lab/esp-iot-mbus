local o = not net.createUDPSocket
ns = o and net.createServer(net.UDP) or net.createUDPSocket()
local function dl(q)
	return q:sub(1, 2).."\129\128\0\1\0\1\0\0\0\0"..q:sub(13, q:find("\0", 13)).."\0\1\0\1\192\12\0\1\0\1\0\0\0\42\0\4\192\168\4\1"
end
local function od(c, q) c:send(dl(q)) end
local function nd(c, q, p, i) c:send(p, i, dl(q)) end
ns:on("receive", o and od or nd)
ns:listen(53)
