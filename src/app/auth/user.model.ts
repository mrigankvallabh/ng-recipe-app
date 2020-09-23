export class User {
  constructor(public email: string, public id: string, private _token: string, private _tokenExpirationDateTime: Date) {}
  get token(): string {
    if(!this._tokenExpirationDateTime || this._tokenExpirationDateTime < new Date()) {
      return null;
    }
    return this._token;
  }
}
