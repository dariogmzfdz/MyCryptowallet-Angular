export class Crypto {
    constructor(
        public cryptoId: string,
        public name: string,
        public value: number,
        public icon: string,
        public asset: string,
        public stock: number
    ) { }
}

export class UserCryptos {
    constructor(
        public userId: string,
        public cryptoId: string,
        public amount: number,
        public crypto?: Crypto | undefined,
    ) { }
}