ls = ""
cf = {}
tmr.create():alarm(2000, 0, function()
	if not cjson then _G.cjson = sjson end
	gpio.mode(3, gpio.OUTPUT)
	gpio.write(3, gpio.HIGH)
	uart.setup(0, 2400, 8, uart.PARITY_EVEN, 1, 0)
	require("connect")(function()
		tmr.create():alarm(100, 0, function()
			require("http")
			require("dnsLiar")
		end)
	end)
end)
