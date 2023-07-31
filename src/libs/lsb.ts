function writeLSB(base64Data, message, callback) {
    const img = new Image();
    img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const binaryMessage = stringToBinary(message);
        const maxMessageLength = calculateMaxMessageLength(imageData.width * imageData.height * 3);

        if (binaryMessage.length > maxMessageLength) {
            callback(new Error('隐藏信息超过最大容量'));
            return;
        }

        const data = imageData.data;
        for (let i = 0; i < binaryMessage.length; i += 3) {
            let red = data[i];
            let green = data[i + 1];
            let blue = data[i + 2];

            if (i < binaryMessage.length) {
                red = setLSB(red, binaryMessage[i]);
                green = setLSB(green, binaryMessage[i + 1]);
                blue = setLSB(blue, binaryMessage[i + 2]);
            }

            data[i] = red;
            data[i + 1] = green;
            data[i + 2] = blue;
        }

        ctx.putImageData(imageData, 0, 0);

        const outputBase64 = canvas.toDataURL();
        callback(null, outputBase64);
    };
    img.src = base64Data;
}

// 将字符串转换为二进制字符串
const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
function stringToBinary(str) {
    let isEqual = 0
    if (str[str.length - 1] == '=') {
        isEqual = 1
        str = str.substring(0, str.length - 1)
    }
    //ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/
    //len before encode is "64", after is 64*3 
    //To note how many bin had used, rather than decode all image pixel

    str = `${isEqual}${str.length.toString().length}${str.length}` + str
    let binary = '';
    for (const char of str) {
        binary += base64Chars.indexOf(char).toString(2).padStart(6, '0');
    }
    return binary;
}

function readLSB(imagePath, callback) {
    const img = new Image();
    img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        let str = '';
        let binary = getBinary(imageData, 2);
        let length = Number(base64Chars[parseInt(binary.substr(6, 6), 2)]) * 6 + 12;
        binary = getBinary(imageData, 2 + length);
        for (let i = 12; i < length; i += 6) {
            str += base64Chars[parseInt(binary.substr(i, 6), 2)];
        }
        let temp = length;
        length = Number(str) * 6 + length;
        binary = getBinary(imageData, length);
        str = '';
        for (let i = temp; i < length; i += 6) {
            str += base64Chars[parseInt(binary.substr(i, 6), 2)];
        }

        if (getBinary(imageData, 1) === '110101') {
            str += '=';
        }
        callback(str)
    };
    img.src = imagePath;
}

function getBinary(imageData, end) {
    end *= 6; // end *6 / 3 = end *2
    let binaryMessage = '';
    const data = imageData.data;

    for (let i = 0; i < end; i += 3) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];
        binaryMessage += getLSB(red);
        binaryMessage += getLSB(green);
        binaryMessage += getLSB(blue);
    }
    return binaryMessage;
}

// 设置最低有效位
function setLSB(byte, bit) {
    return (byte & 0xFE) | bit;
}

// 获取最低有效位
function getLSB(byte) {
    return byte & 0x01;
}

// 计算最大信息容量
function calculateMaxMessageLength(pixelCount) {
    return pixelCount * 3;
}

export { writeLSB, readLSB }
