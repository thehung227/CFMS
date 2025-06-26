import * as CryptoJS from 'crypto-js';

export class CryptoExtension{
    private static key: string = '808080808080abcd8080808080808080';
    private static iv: string = '03@#5005adef%&05';

    static encrypt(data: string) {
        const keyByte = CryptoJS.enc.Utf8.parse(this.key);
        const ivByte = CryptoJS.enc.Utf8.parse(this.iv);

        const ciphertext = CryptoJS.AES.encrypt(data, keyByte, {
            keySize: 256 / 8,
            iv: ivByte,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7});

        return ciphertext.toString();
    }

    static decrypt(data: string) {
        const keyByte = CryptoJS.enc.Utf8.parse(this.key);
        const ivByte = CryptoJS.enc.Utf8.parse(this.iv);

        const _result = CryptoJS.AES.decrypt(
            data, keyByte, {
                keySize: 256 / 8,
                iv: ivByte,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            }
        );

        return _result.toString(CryptoJS.enc.Utf8);
    }
}

