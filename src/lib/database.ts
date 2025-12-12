import fs from "fs/promises";
import path from "path";
import { LightAuditResult } from "@/actions/light-audit";

const DB_PATH = path.join(process.cwd(), "audit-db.json");

export interface AuditRecord extends LightAuditResult {
    id: string;
    targetUrl: string;
    completedAt: string;
}

async function readDb(): Promise<AuditRecord[]> {
    try {
        const data = await fs.readFile(DB_PATH, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function writeDb(data: AuditRecord[]) {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

export async function saveAudit(record: AuditRecord) {
    const db = await readDb();
    const existingIndex = db.findIndex(r => r.slug === record.slug);
    if (existingIndex >= 0) {
        db[existingIndex] = record;
    } else {
        db.push(record);
    }
    await writeDb(db);
}

export async function getAuditBySlug(slug: string): Promise<AuditRecord | undefined> {
    const db = await readDb();
    return db.find(r => r.slug === slug);
}
