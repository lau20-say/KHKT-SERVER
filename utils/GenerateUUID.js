import { v4 as uuidv4 } from 'uuid';

export const generateUUID = () => {
    const uniqueId = uuidv4();
    return uniqueId;
};


