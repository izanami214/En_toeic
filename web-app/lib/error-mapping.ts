export const getErrorMessage = (error: any): string => {
    const defaultMessage = 'Đã có lỗi xảy ra. Vui lòng thử lại sau.';

    if (!error?.response?.data) {
        return defaultMessage;
    }

    const { message, error: errorType } = error.response.data;

    // Handle array of messages (e.g. from class-validator)
    const msg = Array.isArray(message) ? message[0] : message;

    // Common Auth Errors
    if (msg === 'User already exists') return 'Email này đã được đăng ký tài khoản.';
    if (msg === 'Invalid credentials') return 'Email hoặc mật khẩu không chính xác.';
    if (msg === 'Unauthorized') return 'Vui lòng đăng nhập để tiếp tục.';
    if (msg === 'Forbidden resource') return 'Bạn không có quyền truy cập tài nguyên này.';

    // Validation Errors
    if (msg.includes('email must be an email')) return 'Định dạng email không hợp lệ.';
    if (msg.includes('password must be longer than')) return 'Mật khẩu phải dài hơn 6 ký tự.';
    if (msg.includes('should not be empty')) return 'Vui lòng điền đầy đủ thông tin.';

    return msg || defaultMessage;
};
