import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

// 데이터베이스 연결 풀 생성
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'coffee-order-db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  min: parseInt(process.env.DB_POOL_MIN) || 2,
  max: parseInt(process.env.DB_POOL_MAX) || 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
})

// 연결 풀 이벤트 리스너
pool.on('connect', () => {
  console.log('데이터베이스 연결 성공')
})

pool.on('error', (err) => {
  console.error('예상치 못한 데이터베이스 연결 오류:', err)
  process.exit(-1)
})

// 데이터베이스 연결 테스트 함수
export const testConnection = async () => {
  try {
    console.log('데이터베이스 연결 테스트 시작...')
    const client = await pool.connect()
    const result = await client.query('SELECT NOW()')
    console.log('✅ 데이터베이스 연결 테스트 성공:', result.rows[0].now)
    client.release()
    return true
  } catch (error) {
    console.error('❌ 데이터베이스 연결 테스트 실패:')
    console.error('  오류 메시지:', error.message)
    console.error('  오류 코드:', error.code)
    console.error('  오류 상세:', error.detail)
    console.error('  오류 힌트:', error.hint)
    return false
  }
}

// 연결 풀 종료 함수
export const closePool = async () => {
  try {
    await pool.end()
    console.log('데이터베이스 연결 풀이 종료되었습니다.')
  } catch (error) {
    console.error('연결 풀 종료 중 오류:', error)
  }
}

export default pool



