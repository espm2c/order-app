// 데이터베이스 생성 스크립트
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Client } = pg

const createDatabase = async () => {
  // postgres 데이터베이스에 연결 (기본 데이터베이스)
  const adminClient = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: 'postgres', // 기본 데이터베이스
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
  })

  try {
    await adminClient.connect()
    console.log('PostgreSQL 서버에 연결되었습니다.')

    const dbName = process.env.DB_NAME || 'coffee-order-db'
    
    // 데이터베이스 존재 여부 확인
    const checkDbQuery = `
      SELECT 1 FROM pg_database WHERE datname = $1
    `
    const dbExists = await adminClient.query(checkDbQuery, [dbName])

    if (dbExists.rows.length > 0) {
      console.log(`✅ 데이터베이스 '${dbName}'가 이미 존재합니다.`)
    } else {
      // 데이터베이스 생성
      await adminClient.query(`CREATE DATABASE "${dbName}"`)
      console.log(`✅ 데이터베이스 '${dbName}'가 생성되었습니다.`)
    }

    await adminClient.end()
    return true
  } catch (error) {
    console.error('❌ 데이터베이스 생성 실패:', error.message)
    console.error('  오류 코드:', error.code)
    console.error('  오류 상세:', error.detail)
    await adminClient.end()
    return false
  }
}

createDatabase().then(success => {
  if (success) {
    console.log('\n다음 명령어로 데이터베이스를 초기화하세요:')
    console.log('  npm run init-db')
    process.exit(0)
  } else {
    process.exit(1)
  }
})



