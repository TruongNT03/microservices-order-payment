export const mailContent = (order_id: number, name: string) => `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>Thông báo giao hàng</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f6f6f6;
      padding: 20px;
      color: #333;
    }
    .container {
      background-color: #ffffff;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      max-width: 600px;
      margin: auto;
    }
    .header {
      text-align: center;
      margin-bottom: 24px;
    }
    .header h2 {
      color: #2c3e50;
    }
    .content p {
      line-height: 1.6;
    }
    .footer {
      margin-top: 32px;
      font-size: 14px;
      color: #999;
      text-align: center;
    }
    .button {
      display: inline-block;
      background-color: #28a745;
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>🚚 Đơn hàng của bạn đã được vận chuyển!</h2>
    </div>
    <div class="content">
      <p>Xin chào <strong>${name}</strong>,</p>

      <p>Chúng tôi xin thông báo rằng <strong>đơn hàng #${order_id}</strong> của bạn đã được bàn giao cho đơn vị vận chuyển.</p>

      <p>Vui lòng chú ý điện thoại để nhận cuộc gọi từ shipper. Nếu không thể nhận hàng, vui lòng chuẩn bị người nhận thay hoặc liên hệ với chúng tôi để sắp xếp lại.</p>

      <p>📦 Thời gian giao dự kiến: <strong>Trong vòng 2 ngày kể từ này bắt đầu vận chuyển</strong></p>

      <p style="margin-top: 30px;">Cảm ơn bạn đã mua sắm tại <strong>Shop của chúng tôi</strong>. Chúng tôi luôn nỗ lực để mang đến cho bạn trải nghiệm tốt nhất!</p>
    </div>
    <div class="footer">
      <p>© 2025 Shop Online. Mọi thắc mắc xin liên hệ: support@example.com</p>
    </div>
  </div>
</body>
</html>
`;
