// 번역 파일 검사. `ko.json`이 원문이고 다른 언어 파일은 같은 키를 번역한다.
// 실행: bun scripts/check.ts
import { readdirSync, readFileSync } from "node:fs";

const dir = new URL("../locales/", import.meta.url);
const read = (file: string): Record<string, string> => JSON.parse(readFileSync(new URL(file, dir), "utf8"));
const slots = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",");

const errors: string[] = [];
const warnings: string[] = [];
const source = read("ko.json");

for (const file of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
  const locale = file === "ko.json" ? source : read(file);
  const keys = Object.keys(locale);
  keys.forEach((key, i) => {
    if (i > 0 && keys[i - 1] > key) errors.push(`${file}: ${key} 가 가나다순이 아니에요 (${keys[i - 1]} 다음)`);
    const text = locale[key];
    if (typeof text !== "string" || !text.trim()) errors.push(`${file}: ${key} 값이 비어 있어요`);
    if (file === "ko.json") return;
    if (!(key in source)) errors.push(`${file}: ${key} 는 ko.json에 없는 키예요`);
    else if (slots(text) !== slots(source[key])) errors.push(`${file}: ${key} 의 {자리}가 ko.json과 달라요`);
  });
  if (file !== "ko.json") {
    const missing = Object.keys(source).filter((k) => !(k in locale));
    if (missing.length) warnings.push(`${file}: 번역 안 된 키 ${missing.length}개 (한국어로 보여요)`);
  }
}

warnings.forEach((w) => console.warn(`경고: ${w}`));
errors.forEach((e) => console.error(`오류: ${e}`));
if (errors.length) process.exit(1);
console.log(`통과: ko.json 키 ${Object.keys(source).length}개`);
