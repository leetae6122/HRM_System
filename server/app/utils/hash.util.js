import bcrypt from 'bcryptjs';

export const hashData = (data) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(data, salt);
}

export const compareHashedData = async (data, hashedData) => {
    return bcrypt.compareSync(
        data,
        hashedData
    );
}

export const hashToken = async (token) => {
    const tokenSlice = token ? token.slice(token.lastIndexOf('.')) : null;
    const tokenHashed = tokenSlice ? hashData(tokenSlice) : null;
    return tokenHashed;
}

