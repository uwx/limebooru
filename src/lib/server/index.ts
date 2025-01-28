import { join } from "node:path";

export function getRealImagePath(location: string) {
    return join('./images', location)
}