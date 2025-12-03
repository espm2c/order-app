import dotenv from 'dotenv'
import pg from 'pg'

dotenv.config()

const { Pool } = pg

console.log('============================================================')
console.log('PostgreSQL 데이터베이스 연결 테스트')
console.log('============================================================\n')

console.log('연결 설정:')
console.log(`  Host: ${process.env.DB_HOST || 'localhost'}`)
console.log(`  Port: ${process.env.DB_PORT || '5432'}`)
console.log(`  Database: ${process.env.DB_NAME || 'coffee-order-db'}`)
console.log(`  User: ${process.env.DB_USER || 'postgres'}`)
console.log(`  Password: ${process.env.DB_PASSWORD ? '***' : '(설정되지 않음)'}\n`)

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'coffee-order-db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  connectionTimeoutMillis: 10000,
})

try {
  console.log('데이터베이스 연결 시도 중...\n')
  const client = await pool.connect()
  
  console.log('✅ 연결 성공!\n')
  
  // 데이터베이스 버전 확인
  const versionResult = await client.query('SELECT version()')
  console.log('PostgreSQL 버전:', versionResult.rows[0].version.split(',')[0])
  
  // 현재 데이터베이스 확인
  const dbResult = await client.query('SELECT current_database()')
  console.log('현재 데이터베이스:', dbResult.rows[0].current_database)
  
  // 테이블 목록 확인
  const tablesResult = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name
  `)
  
  if (tablesResult.rows.length > 0) {
    console.log('\n존재하는 테이블:')
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`)
    })
  } else {
    console.log('\n⚠️  테이블이 없습니다. 데이터베이스를 초기화해야 합니다.')
  }
  
  client.release()
  await pool.end()
  
  console.log('\n✅ 데이터베이스 연결 테스트 완료!')
  process.exit(0)
} catch (error) {
  console.error('\n❌ 연결 실패!\n')
  console.error('오류 정보:')
  console.error(`  메시지: ${error.message}`)
  console.error(`  코드: ${error.code}`)
  console.error(`  상세: ${error.detail || '(없음)'}`)
  console.error(`  힌트: ${error.hint || '(없음)'}`)
  
  if (error.code === '28P01') {
    console.error('\n💡 인증 실패: 비밀번호가 올바르지 않습니다.')
    console.error('   .env 파일의 DB_PASSWORD를 확인해주세요.')
  } else if (error.code === '3D000') {
    console.error('\n💡 데이터베이스가 존재하지 않습니다.')
    console.error('   데이터베이스를 먼저 생성해주세요.')
  } else if (error.code === 'ECONNREFUSED') {
    console.error('\n💡 연결 거부: PostgreSQL 서비스가 실행 중인지 확인해주세요.')
  }
  
  await pool.end()
  process.exit(1)
}

