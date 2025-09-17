//คำสั่ง run dev
npm run start:dev

//คำสั่ง run prod
npm run build
node dist/app.js

//คำสั่ง run test
npm run build
npm run test


// socket
ws:https://nanobot-mjgu.onrender.com/kline
message body:
{
    "symbol":"BTCUSDT",
    "interval":"1m"
}

socket on:"subscribeKline"

emit event: 
	klineUpdate,
	onlineCount
