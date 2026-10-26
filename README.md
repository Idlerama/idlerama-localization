# Idlerama localization

[Idlerama](https://github.com/markab-j/idlerama-app) 앱에 보이는 문구를 모아 둔 저장소예요. 앱은 이 저장소를 `packages/localization` 서브모듈로 받아 씁니다.

지원 언어: 한국어(`ko`)

## 파일 구조

```
locales/
  ko.json         원문(한국어). 모든 키의 기준
  <언어>.json     번역. ko.json과 같은 키를 쓴다
scripts/
  check.ts        번역 파일 검사
```

언어 파일은 키와 문장만 있는 평평한 JSON이에요. 키가 원문과 번역을 잇습니다. 번역할 때는 `ko.json`(원문)과 내 언어 파일(번역)을 나란히 열고 같은 키의 값을 옮기면 돼요.

```json
{
  "settings.general.alwaysOnTop": "항상 맨 위",
  "error.packs.notFound": "팩을 찾지 못했어요",
  "editor.frames.count": "프레임 {count}"
}
```

`{count}`처럼 중괄호로 감싼 자리에는 앱이 값을 채워요. 번역에서도 그대로 둡니다.

## 앱에서 쓰는 방식

- Svelte: `src/lib/i18n.ts`의 `t("키", { 자리: 값 })`. 없는 키는 `svelte-check`가 오류로 알려요.
- Rust: `src-tauri/src/i18n.rs`의 `t("키")`, `fill("키", &[("자리", &값)])`. 트레이 메뉴, 창 제목, 오류 문구에 씁니다. 없는 키는 `cargo test`가 잡아요.

두 쪽 모두 빌드할 때 `locales/ko.json`을 앱 안에 넣어요. 실행 중에 파일을 읽지 않아요.

## 검사

```sh
bun scripts/check.ts
```

- JSON 문법, 키 가나다순, 빈 값
- 번역 파일: `ko.json`에 없는 키, `{자리}`가 원문과 다른 값은 오류
- 번역 파일에서 빠진 키는 경고만 해요. 앱은 그 문구를 한국어로 보여 줘요

참여 방법은 [CONTRIBUTING.md](CONTRIBUTING.md)를 보세요.
