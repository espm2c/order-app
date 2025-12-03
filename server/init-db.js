// 데이터베이스 초기화 스크립트
import { initDatabase, insertInitialData } from './src/models/init-db.js'

const main = async () => {
  try {
    console.log('데이터베이스 초기화를 시작합니다...\n')
    await initDatabase()
    await insertInitialData()
    console.log('\n✅ 데이터베이스 설정이 완료되었습니다!')
    process.exit(0)
  } catch (error) {
    console.error('\n❌ 데이터베이스 설정 실패:', error)
    process.exit(1)
  }
}

main()



