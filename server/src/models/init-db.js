import pool from './db.js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// SQL 스키마 파일 읽기
const schemaSQL = readFileSync(join(__dirname, 'schema.sql'), 'utf8')

// 데이터베이스 초기화 함수
export const initDatabase = async () => {
  const client = await pool.connect()
  
  try {
    console.log('데이터베이스 초기화 시작...')
    
    // 트랜잭션 시작
    await client.query('BEGIN')
    
    // 스키마 실행
    await client.query(schemaSQL)
    
    // 트랜잭션 커밋
    await client.query('COMMIT')
    
    console.log('✅ 데이터베이스 초기화 완료')
    return true
  } catch (error) {
    // 트랜잭션 롤백
    await client.query('ROLLBACK')
    console.error('❌ 데이터베이스 초기화 실패:', error.message)
    throw error
  } finally {
    client.release()
  }
}

// 초기 데이터 삽입 함수
export const insertInitialData = async () => {
  const client = await pool.connect()
  
  try {
    console.log('초기 데이터 삽입 시작...')
    
    await client.query('BEGIN')
    
    // 메뉴 데이터 삽입
    const menuResult = await client.query(`
      INSERT INTO menus (name, description, price, image_url, stock)
      VALUES
        ('아메리카노(HOT)', '따뜻한 아메리카노', 4000, 'https://images.unsplash.com/photo-1514432324607-a09d9b4a53dd?w=400', 10),
        ('아메리카노(ICE)', '시원한 아메리카노', 4000, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', 10),
        ('카페라떼', '부드러운 라떼', 5000, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', 8),
        ('카푸치노', '진한 카푸치노', 5000, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400', 8),
        ('카라멜 마키아토', '달콤한 카라멜 마키아토', 5500, 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400', 5)
      ON CONFLICT (name) DO NOTHING
      RETURNING id, name
    `)
    
    // 옵션 데이터 삽입
    const menus = await client.query('SELECT id, name FROM menus')
    
    for (const menu of menus.rows) {
      await client.query(`
        INSERT INTO options (name, price, menu_id)
        VALUES
          ('샷 추가', 500, $1),
          ('시럽 추가', 0, $1)
        ON CONFLICT DO NOTHING
      `, [menu.id])
    }
    
    await client.query('COMMIT')
    
    console.log('✅ 초기 데이터 삽입 완료')
    return true
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('❌ 초기 데이터 삽입 실패:', error.message)
    throw error
  } finally {
    client.release()
  }
}

// 데이터베이스 초기화 및 초기 데이터 삽입
const main = async () => {
  try {
    await initDatabase()
    await insertInitialData()
    console.log('\n✅ 데이터베이스 설정이 완료되었습니다!')
    process.exit(0)
  } catch (error) {
    console.error('\n❌ 데이터베이스 설정 실패:', error)
    process.exit(1)
  }
}

// 직접 실행 시
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}



