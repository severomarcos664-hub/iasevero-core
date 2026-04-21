import fs from "fs"
import path from "path"

const filePath = path.join(process.cwd(), "data", "memory.json")

export function readMemory() {
  try {
    const data = fs.readFileSync(filePath, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

export function writeMemory(messages: any[]) {
  fs.writeFileSync(filePath, JSON.stringify(messages, null, 2))
}
