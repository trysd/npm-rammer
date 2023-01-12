const base = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

export class MBase64 {

  public static btoa(str: string): string {
    return Array.from(new TextEncoder().encode(str))
      .map(x => x.toString(2).padStart(8, "0"))
      .join("")
      .padEnd(Math.ceil(str.length * 8 / 6) * 6, "0")
      .split(/(.{6})/)
      .filter(x => x)
      .map(x => base[parseInt(x, 2)])
      .join("")
  };

  public static atob(e: string): Uint8Array {
    let t = e.replace(/=/g, "").split(""),
      res = new Uint8Array(6 * t.length / 8),
      connect = 0,
      unit = 0;
    return t.forEach((e, t) => {
      let x = base.indexOf(e),
      mod = t % 4;
      if (0 === mod) {
        connect = x << 2; return
      }
      let f = 6 - 2 * mod;
      connect += x >>> f,
      res[unit] = connect,
      unit++,
      connect = (x << 8 - f) % 256
    }), res
  };

}
