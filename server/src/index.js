import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { exec } from 'child_process'
import { platform } from 'os'
import { testConnection, closePool } from './models/db.js'

// 환경 변수 로드
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// 외부 브라우저에서 URL 열기 함수
const openBrowser = (url) => {
  const currentPlatform = platform()
  let command

  if (currentPlatform === 'win32') {
    // Windows: PowerShell을 통해 Chrome 실행 (더 안정적)
    // Chrome 경로를 직접 찾아서 실행
    const chromePaths = [
      process.env['ProgramFiles'] + '\\Google\\Chrome\\Application\\chrome.exe',
      process.env['ProgramFiles(x86)'] + '\\Google\\Chrome\\Application\\chrome.exe',
      process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe'
    ]
    
    // Chrome을 찾으면 직접 실행, 없으면 기본 브라우저 사용
    command = `powershell -Command "& { $chrome = @('${chromePaths.join("','")}') | Where-Object { Test-Path $_ } | Select-Object -First 1; if ($chrome) { Start-Process -FilePath $chrome -ArgumentList '${url}' } else { Start-Process '${url}' } }"`
  } else if (currentPlatform === 'darwin') {
    // macOS
    command = `open "${url}"`
  } else {
    // Linux
    command = `xdg-open "${url}"`
  }

  exec(command, (error) => {
    if (error) {
      console.log(`\n⚠️  브라우저를 자동으로 열 수 없습니다.`)
      console.log(`🌐 수동으로 다음 URL을 열어주세요: ${url}\n`)
    }
  })
}

// 미들웨어 설정
app.use(cors()) // CORS 허용
app.use(express.json()) // JSON 파싱
app.use(express.urlencoded({ extended: true })) // URL 인코딩된 데이터 파싱

// 기본 라우트
app.get('/', (req, res) => {
  res.json({
    message: '커피 주문 앱 API 서버',
    version: '1.0.0'
  })
})

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  })
})

// API 라우트 (추후 추가)
// app.use('/api', apiRoutes)

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error: {
      message: err.message || '서버 오류가 발생했습니다.',
      code: 'INTERNAL_SERVER_ERROR'
    }
  })
})

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: '요청한 리소스를 찾을 수 없습니다.',
      code: 'NOT_FOUND'
    }
  })
})

// 서버 시작
app.listen(PORT, async () => {
  const url = `http://localhost:${PORT}`
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`)
  console.log(`\n🌐 서버 URL: ${url}`)
  
  // 데이터베이스 연결 테스트
  await testConnection()
  
  // 외부 브라우저에서 자동으로 열기
  setTimeout(() => {
    openBrowser(url)
  }, 1000) // 서버가 완전히 시작된 후 1초 뒤에 브라우저 열기
})

// 프로세스 종료 시 연결 풀 정리
process.on('SIGINT', async () => {
  console.log('\n서버 종료 중...')
  await closePool()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\n서버 종료 중...')
  await closePool()
  process.exit(0)
})

