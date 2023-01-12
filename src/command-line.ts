import { MFile } from "./MFile";
import * as fs from 'fs-extra';
import { MBase64 } from "./MBase64";
import { v4 as uuidv4 } from 'uuid';
import readline from 'readline';

export class CommandLine {

  private commandLine: string[] = [];

  constructor(commandLine: string[]) {
    this.commandLine = commandLine;
  }

  public main(): void {
    const options = this.commandLine.map(m => m.match(/^-/) ? m : null).filter(f => f != null) as string[];
    const targets: string[] = this.commandLine.filter(f => !f.match(/^-/)).slice(2, 4) as string[];

    if (options.includes('--decode')) {
      this.unrammer(options, targets);
    } else {
      this.rammer(options, targets);
    }
  }

  private unrammer(options: string[], targets: string[]): void {
    console.log(options, targets);
    const readRammerFile = targets[0] as string;
    const writeBaseDir = targets[1] as string;
    let active = false;
    const td = new TextDecoder();
    readline.createInterface({ input: fs.createReadStream(readRammerFile) }).on('line', (li) => {
      if (!active && li === 'format=txt') {
        active = true;
      } else if (active) {
        const fb = li.split(':');
        const fileName = td.decode(MBase64.atob(fb[0] as string));
        const body = td.decode(MBase64.atob(fb[1] as string));
        fs.outputFileSync('./' + writeBaseDir + '/' + fileName, body);
      }
    });
    console.log('done.');
  }

  private rammer(options: string[], targets: string[]): void {

    const readDir = targets[0] as string;
    const tempFile = './~tmp.' + uuidv4();
  
    const writeFile = targets[1] as string;

    fs.removeSync(writeFile);
    const fileList = MFile.readDir(readDir, [], []);

    //
    // header
    //
    const header = () => {
      if (options.includes('--type-js')) {
        fs.appendFileSync(tempFile, 
          'var file = {};\n'
        );
      }
      else if (options.includes('--type-ts')) {
        fs.appendFileSync(tempFile, 
          'const _files: { [key in IFiles]: string } = {\n'
        );
      }
      else {
        fs.appendFileSync(tempFile, 
          'format=txt\n'
        );
      }
    };


    header();

    //
    // body
    //
    fileList.forEach((f, i) => {      
      const targetFile = targets[0]
      + ( !targets[0]?.match(/\/$/) ? '/' : '')
      + f;

      console.log(`execute(${fileList.length}/${i + 1}): ${targetFile}`);
      const mStr = fs.readFileSync(targetFile).toString();
      if (options.includes('--type-js')) {
        fs.appendFileSync(tempFile, 
          `files["${f}"] = "${MBase64.btoa(mStr)}";\n`
        );
      }
      else if (options.includes('--type-ts')) {
        fs.appendFileSync(tempFile, 
          `  "${f}": "${MBase64.btoa(mStr)}"${fileList.length - 1 == i ? '' : ','}\n`
        );
      }
      else {
        fs.appendFileSync(tempFile, 
          `${MBase64.btoa(f)}:${MBase64.btoa(mStr)}\n`
        );
      }
    })

    //
    // footer
    //
    const footer = () => {
      if (options.includes('--type-js')) {
        fs.appendFileSync(tempFile, 
          'module.exports = file;'
        );
      }
      else if (options.includes('--type-ts')) {
        const c = (targets[1] + '')
        .replace(/^.*?([^\/]+)$/, '$1')
        .replace(/^(.+?)\.[^\.]+?$/, '$1')
        .replace(/-[a-z0-9]/, function(a) { return a.replace(/-/, '').toUpperCase() })
        .replace(/^[a-z]/, function(a) { return a.toUpperCase() });

        fs.appendFileSync(tempFile, `};

export type IFiles = \n${fileList.map(m => `  "${m}"`).join(' |\n')};

export class ${c} {
  public static get(fileName: IFiles): string {
    return new TextDecoder().decode(XAfter.decodeBase64(_files[fileName]));
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
}`
        );
      }
    };
    footer();

    fs.copyFileSync(tempFile, writeFile);
    // fs.renameSync(tempFile, writeFile);

    console.log('done.');
    const size = fs.statSync(tempFile).size;
    if (size < 1024) {
      console.log('total size:', fs.statSync(tempFile).size, 'B');
    } else if (size < 1024 * 1024) {
      console.log('total size:', (fs.statSync(tempFile).size / 1024).toFixed(3), 'KB');
    } else {
      console.log('total size:', (fs.statSync(tempFile).size / 1024 / 1024).toFixed(3), 'MB');
    }
    console.log(`${fileList.length} files into "${writeFile}" were rammed.`);

    fs.removeSync(tempFile);

  }

}
