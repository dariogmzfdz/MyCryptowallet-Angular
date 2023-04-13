export class User {
    constructor(
        public userId: string,
        public username: string,
        public password: string,
        public email: string,
        public fullname: string,
        public birthdate: string,
        public deposit: number,
    ) { }
}