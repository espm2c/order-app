# Cursor에서 외부 브라우저로 URL 열기 설정

## 현재 적용된 설정

### 1. `.vscode/settings.json`
- `terminal.integrated.openUrl: true` - 터미널 URL을 외부 브라우저에서 열기
- `cursor.openExternal: true` - Cursor에서 외부 브라우저 사용

### 2. `.cursorconfig`
- `openLinksInExternalBrowser: true`
- `openExternal: true`
- `cursor.openExternal: true`

## 수동 방법 (가장 확실함)

### 방법 1: Ctrl + 클릭
터미널에서 URL을 **Ctrl 키를 누른 채로 클릭**하면 외부 브라우저에서 열립니다.

### 방법 2: 우클릭 메뉴
터미널에서 URL을 **우클릭**하고 "외부 브라우저에서 열기" 또는 "Open in External Browser" 선택

### 방법 3: URL 복사 후 직접 열기
1. 터미널에서 URL을 선택하여 복사 (Ctrl+C)
2. Chrome 브라우저 주소창에 붙여넣기 (Ctrl+V)
3. Enter 키 누르기

## Cursor 설정에서 직접 변경

1. **Cursor 설정 열기**: `Ctrl + ,` (또는 `Cmd + ,`)
2. 검색창에 다음 키워드로 검색:
   - "browser"
   - "open url"
   - "external browser"
3. 관련 설정을 찾아서 "외부 브라우저" 옵션으로 변경

## Windows에서 기본 브라우저 설정 확인

Cursor는 시스템의 기본 브라우저를 사용합니다. Chrome을 기본 브라우저로 설정:

1. Windows 설정 열기
2. "앱" → "기본 앱" 선택
3. "웹 브라우저"에서 Chrome 선택

## 참고

- 설정 변경 후 **Cursor를 완전히 재시작**해야 합니다.
- 일부 Cursor 버전에서는 내부 브라우저를 완전히 비활성화할 수 없을 수 있습니다.
- 이 경우 위의 수동 방법을 사용하는 것이 가장 확실합니다.





