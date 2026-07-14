const jwt = require('jsonwebtoken');

// Middleware bảo vệ các router yêu cầu đăng nhập
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Bạn chưa đăng nhập. Vui lòng đăng nhập để truy cập tính năng này!'
      });
    }

    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Lưu thông tin giải mã (id, role, email) vào req.user
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại!'
    });
  }
};

// Middleware chỉ cho phép tài khoản Admin truy cập
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Bạn không có quyền truy cập tính năng này! (Chỉ dành cho Admin)'
    });
  }
};
