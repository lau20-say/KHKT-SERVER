import bcrypt from "bcrypt";

// Hàm băm mật khẩu
export const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10); // Tạo salt với độ khó 10
        return await bcrypt.hash(password, salt); // Trả về mật khẩu đã được băm
    } catch (error) {
        throw new Error("Error hashing the password");
    }
};

// Hàm so sánh mật khẩu với mật khẩu đã băm
export const comparePassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword); // So sánh mật khẩu và mật khẩu đã băm
    } catch (error) {
        throw new Error("Error comparing passwords");
    }
};
