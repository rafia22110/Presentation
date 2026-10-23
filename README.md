# 🌌 Presentation — EduHolo Studio Production (`rafia22110/Presentation`)
### מצגת שבעת ימי הבריאה לכיתה ב' + מזווה משאבים פתוח + מנוע HTMX ושכבת מניפסט פדגוגי בית-ספרי

מאגר זה מכיל את אפליקציית **React 19 + Three.js + Express + Gemini/ElevenLabs TTS** המשודרגת לארכיטקטורת **EduHolo Studio Production**:
* **אינדקס בסיס הנתונים החי ב-Google Sheets:** [EduHolo Open Pantry — אינדקס מאגר משאבים, מקורות יהודיים ומניפסט פדגוגי בית-ספרי](https://docs.google.com/spreadsheets/d/1eo30sgIoprD8NqWYemZ68uUEQxqXLnnGf0QKH_DUbgg/edit)
* **מסמך ארכיטקטורת המערכת ופרומפט ה-LLM ב-Google Docs:** [EduHolo Architecture & System Prompt](https://docs.google.com/document/d/1-bDMOB1Q4yBaeF38aO4qfyCnw_voNjcbXMHWv6t6r3I/edit)

## ✨ שלוש שכבות "החדשנות הסטרילית" (Combinatorial Creativity)
1. **מזווה רכיבים מאושר (`public/pantry/` & `src/data/pantryData.ts`)** – חיבור כל שקופית (0–7) לפסוקי המקור המנוקדים ב-[ספריא (Sefaria)](https://www.sefaria.org/Genesis.1.1-31), ליחידות ההוראה ב-[מיזם 929](https://edu.929.org.il/class/%D7%94%D7%99%D7%95%D7%9D-%D7%94%D7%A8%D7%90%D7%A9%D7%95%D7%9F/), ול-12 סרטוני YouTube מאומתים (חנה הס, פרויקט 929, אורית בסיפורי בראשית, הידברות, פילפילון, Kurzgesagt, Up and Atom ו-ADDitude Magazine).
2. **במת שורטס וסימולטור NotebookLM (`src/components/NotebookLMStage.tsx`)** – דו-שיח מנחי AI (דניאל ונועה) המסונכרן עם מנוע ההקראה וכולל אפשרות להעלאת קובצי Audio Overview מקומיים.
3. **מנוע מניפסט פדגוגי בית-ספרי לרכזות מקצוע (`src/components/ManifestoAndPantryBar.tsx`)** – הזרקה דינמית לפי מניפסט רכזת פדגוגית (`MAN-PED-01`), רכזת תנ"ך (`MAN-TAN-02`), רכזת אנגלית CLIL (`MAN-ENG-03`) ורכזת מתמטיקה ומדעים (`MAN-STEM-04`).
