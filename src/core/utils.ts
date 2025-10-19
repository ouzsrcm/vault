import * as os from "os";
import * as path from "path";

export function getUserDocumentsPath(): string {
    const home = os.homedir();
    return path.join(home, "Documents");
}
