const _files: { [key in IFiles]: string } = {
  "floor/floor.tpl": "LnRlc3QgewogICAgY29sb3I6IHdoaXRlOwp9",
  "sample.tpl": "PGh0bWw+CiAgICA8Ym9keT4KICAgICAgICBzYW1wbGUKICAgIDwvYm9keT4KPC9odG1sPgo"
};

export type IFiles = 
  "floor/floor.tpl" |
  "sample.tpl";

export class AfterSample {
  public static get(fileName: IFiles): string {
    return new TextDecoder().decode(AfterSample.decodeBase64(_files[fileName]));
  }
  public static getFileNameList(): string[] {
    return Object.keys(_files);
  }
  public static getFiles() {
    return _files;
  }
  public static decodeBase64(e: string): Uint8Array {
    let t = e.replace(/=/g, "").split(""), l = new Uint8Array(6 * t.length / 8), n = 0, r = 0;
    return t.forEach((e, t) => { let x = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(e), c = t % 4; if (0 === c) { n = x << 2; return } let f = 6 - 2 * c; n += x >>> f, l[r] = n, r++, n = (x << 8 - f) % 256 }), l
  }
}