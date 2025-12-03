# Cursor에서 Ctrl+Click으로 외부 Chrome 브라우저 열기 설정

## 문제
Cursor에서 Ctrl+Click으로 링크를 클릭할 때 내부 탭에서 열리는 문제

## 해결 방법

### 방법 1: Windows 기본 브라우저를 Chrome으로 설정 (가장 확실함)

1. **Windows 설정 열기**
   - `Win + I` 키를 누르거나 시작 메뉴에서 "설정" 검색

2. **기본 앱 설정**
   - "앱" → "기본 앱" 선택
   - "웹 브라우저" 섹션에서 **Chrome** 선택

3. **Cursor 재시작**
   - Cursor를 완전히 종료하고 다시 실행

### 방법 2: Cursor 설정 확인

1. **설정 열기**: `Ctrl + ,`
2. 검색창에 다음 키워드로 검색:
   - `terminal.integrated.openUrl`
   - `editor.links`
3. 다음 설정이 활성화되어 있는지 확인:
   - ✅ `terminal.integrated.openUrl`: true
   - ✅ `editor.links`: true

### 방법 3: 키보드 단축키 변경

1. **단축키 설정 열기**: `Ctrl + K, Ctrl + S`
2. 검색창에 "open link" 검색
3. "Open Link" 명령어의 단축키 확인/변경
4. 필요시 `Ctrl + Click` 대신 다른 단축키 사용

### 방법 4: 수동으로 브라우저 열기

터미널에서 URL을 복사한 후:
1. URL 선택 → `Ctrl + C` (복사)
2. Chrome 브라우저 열기
3. 주소창에 `Ctrl + V` (붙여넣기)
4. `Enter` 키 누르기

### 방법 5: PowerShell 스크립트 사용

프로젝트 루트에 있는 `open-browser.ps1` 스크립트를 사용:

```powershell
.\open-browser.ps1 -Url "http://localhost:3000"
```

## 현재 적용된 설정

### `.vscode/settings.json`
```json
{
  "terminal.integrated.openUrl": true,
  "editor.links": true,
  "terminal.integrated.enableFileLinks": true,
  "cursor.openExternal": true
}
```

### `.cursorconfig`
```json
{
  "openLinksInExternalBrowser": true,
  "openExternal": true,
  "cursor": {
    "openExternal": true
  }
}
```

## 확인 사항

1. ✅ Windows 기본 브라우저가 Chrome으로 설정되어 있는가?
2. ✅ Cursor가 최신 버전인가?
3. ✅ 설정 파일이 올바르게 저장되었는가?
4. ✅ Cursor를 재시작했는가?

## 추가 팁

- 서버를 실행하면 자동으로 외부 Chrome 브라우저가 열립니다 (`server/src/index.js`에 구현됨)
- 터미널에서 URL을 우클릭하면 "외부 브라우저에서 열기" 옵션이 나타납니다
- URL을 선택하고 `Ctrl + C`로 복사한 후 Chrome 주소창에 붙여넣을 수 있습니다

## 문제 해결

여전히 내부 탭에서 열리는 경우:

1. **Cursor 완전 재시작**: 모든 Cursor 창을 닫고 다시 실행
2. **Windows 기본 브라우저 확인**: Chrome이 기본 브라우저인지 확인
3. **설정 파일 확인**: `.vscode/settings.json`과 `.cursorconfig` 파일이 올바른지 확인
4. **Cursor 버전 업데이트**: 최신 버전으로 업데이트




