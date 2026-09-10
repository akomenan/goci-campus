const QRCode = require('/workspace/estudy-world/node_modules/qrcode');
const url = 'exp://lnnlkxu-anonymous-8081.exp.direct';
QRCode.toFile('/workspace/estudy-world-qr.png', url, { type: 'png', width: 512, margin: 2 }, (err) => {
  if (err) { console.error(err); process.exit(1); }
  console.log('wrote qr for', url);
});
