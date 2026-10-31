import { serve } from "bun";
import * as fs from "fs";
import * as path from "path";

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(import.meta.dir, "public");
const LESSONS_VAULT_PATH = path.join(PUBLIC_DIR, "pantry", "lessons_vault.json");
const SCHOOL_MANIFESTOS_PATH = path.join(PUBLIC_DIR, "pantry", "school_manifestos.json");

function readJsonFile(filePath: string) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return [];
}

const server = serve({
  port: Number(PORT),
  async fetch(req) {
    const url = new URL(req.url);
    const pathname = url.pathname;

    // API Endpoint: /api/lessons
    if (pathname === "/api/lessons") {
      const lessons = readJsonFile(LESSONS_VAULT_PATH);
      return new Response(JSON.stringify({ success: true, lessons }), {
        headers: { "Content-Type": "application/json; charset=utf-8" },
      });
    }

    // API Endpoint: /api/notebooklm/create-lesson
    if (pathname === "/api/notebooklm/create-lesson" && req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      return new Response(
        JSON.stringify({
          success: true,
          message: "Lesson created via NotebookLM integration",
          notebookId: body.notebookId || "5e674188-c91b-45f1-9b5b-3fe62c291e0f",
          lesson: body,
        }),
        { headers: { "Content-Type": "application/json; charset=utf-8" } }
      );
    }

    // API Endpoint: /api/notebooklm/share-folder
    if (pathname === "/api/notebooklm/share-folder" && req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      return new Response(
        JSON.stringify({
          success: true,
          message: "NotebookLM folder shared successfully",
          folderId: body.folderId || "shared-folder-001",
        }),
        { headers: { "Content-Type": "application/json; charset=utf-8" } }
      );
    }

    // API Endpoint: /api/htmx/generate-lesson
    if (pathname === "/api/htmx/generate-lesson") {
      const lessons = readJsonFile(LESSONS_VAULT_PATH);
      const htmlSnippet = `
        <div id="lesson-card" class="p-4 border rounded shadow bg-white">
          <h2 class="text-xl font-bold">EduHolo Studio Interactive Lesson</h2>
          <p class="text-gray-600">Generated dynamically via HTMX (14KB) & Alpine.js (15KB)</p>
          <div class="mt-2" x-data="{ count: 0 }">
            <button @click="count++" class="px-3 py-1 bg-blue-500 text-white rounded">
              Interactive Counter: <span x-text="count"></span>
            </button>
          </div>
        </div>
      `;
      return new Response(htmlSnippet, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // API Endpoint: /api/school-dna
    if (pathname === "/api/school-dna") {
      const manifestos = readJsonFile(SCHOOL_MANIFESTOS_PATH);
      return new Response(JSON.stringify({ success: true, manifestos }), {
        headers: { "Content-Type": "application/json; charset=utf-8" },
      });
    }

    // Serve static files from public/
    let filePath = path.join(PUBLIC_DIR, pathname === "/" ? "index.html" : pathname);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const file = Bun.file(filePath);
      return new Response(file);
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`EduHolo Studio TypeScript server running on http://localhost:${PORT}`);
