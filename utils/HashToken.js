import bcrypt from "bcrypt"

// Băm token trước khi lưu
export const hashToken = async (token) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(token, salt);
};

// Xác thực token khi nhận được
export const verifyToken = async (token, hashedToken) => {
    return bcrypt.compare(token, hashedToken);
};
