import { useState } from 'react'
import './App.css'

// 임의의 커피 메뉴 데이터
const MENU_DATA = [
  {
    id: 1,
    name: '아메리카노(ICE)',
    price: 4000,
    description: '시원하고 깔끔한 에스프레소 샷과 물',
    imageUrl: null,
    options: [
      { id: 1, name: '샷 추가', price: 500 },
      { id: 2, name: '시럽 추가', price: 0 }
    ]
  },
  {
    id: 2,
    name: '아메리카노(HOT)',
    price: 4000,
    description: '따뜻하고 진한 에스프레소 샷과 물',
    imageUrl: null,
    options: [
      { id: 1, name: '샷 추가', price: 500 },
      { id: 2, name: '시럽 추가', price: 0 }
    ]
  },
  {
    id: 3,
    name: '카페라떼',
    price: 5000,
    description: '부드러운 에스프레소와 스팀 밀크',
    imageUrl: null,
    options: [
      { id: 1, name: '샷 추가', price: 500 },
      { id: 2, name: '시럽 추가', price: 0 }
    ]
  },
  {
    id: 4,
    name: '카푸치노',
    price: 5000,
    description: '에스프레소와 우유 거품의 조화',
    imageUrl: null,
    options: [
      { id: 1, name: '샷 추가', price: 500 },
      { id: 2, name: '시럽 추가', price: 0 }
    ]
  },
  {
    id: 5,
    name: '바닐라라떼',
    price: 5500,
    description: '바닐라 시럽이 들어간 부드러운 라떼',
    imageUrl: null,
    options: [
      { id: 1, name: '샷 추가', price: 500 },
      { id: 2, name: '시럽 추가', price: 0 }
    ]
  }
]

function App() {
  const [cart, setCart] = useState([])

  // 장바구니에 아이템 추가
  const addToCart = (menu, selectedOptions) => {
    const optionIds = selectedOptions.map(opt => opt.id).sort().join(',')
    const cartKey = `${menu.id}-${optionIds}`
    
    const existingItemIndex = cart.findIndex(item => item.cartKey === cartKey)
    
    if (existingItemIndex >= 0) {
      // 이미 장바구니에 있으면 수량 증가
      const newCart = [...cart]
      newCart[existingItemIndex].quantity += 1
      newCart[existingItemIndex].totalPrice = 
        newCart[existingItemIndex].basePrice * newCart[existingItemIndex].quantity
      setCart(newCart)
    } else {
      // 새 아이템 추가
      const basePrice = menu.price + selectedOptions.reduce((sum, opt) => sum + opt.price, 0)
      const newItem = {
        cartKey,
        menuId: menu.id,
        menuName: menu.name,
        basePrice,
        selectedOptions: [...selectedOptions],
        quantity: 1,
        totalPrice: basePrice
      }
      setCart([...cart, newItem])
    }
  }

  // 장바구니 아이템 제거
  const removeFromCart = (cartKey) => {
    setCart(cart.filter(item => item.cartKey !== cartKey))
  }

  // 총 금액 계산
  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + item.totalPrice, 0)
  }

  // 주문하기
  const handleOrder = () => {
    if (cart.length === 0) {
      alert('장바구니가 비어있습니다.')
      return
    }

    const orderData = {
      items: cart.map(item => ({
        menuId: item.menuId,
        menuName: item.menuName,
        options: item.selectedOptions.map(opt => ({
          optionId: opt.id,
          optionName: opt.name
        })),
        quantity: item.quantity,
        price: item.basePrice
      })),
      totalAmount: getTotalAmount()
    }

    console.log('주문 데이터:', orderData)
    alert(`주문이 완료되었습니다!\n총 금액: ${getTotalAmount().toLocaleString()}원`)
    setCart([])
  }

  return (
    <div className="app">
      {/* 헤더 */}
      <header className="header">
        <div className="logo">COZY</div>
        <div className="header-buttons">
          <button className="nav-button active">주문하기</button>
          <button className="nav-button">관리자</button>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="main-content">
        {/* 메뉴 카드 영역 */}
        <div className="menu-container">
          {MENU_DATA.map(menu => (
            <MenuCard 
              key={menu.id} 
              menu={menu} 
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </main>

      {/* 장바구니 */}
      <div className="cart-container">
        <div className="cart">
          <h2 className="cart-title">장바구니</h2>
          <div className="cart-content">
            <div className="cart-items">
              {cart.length === 0 ? (
                <p className="empty-cart">장바구니가 비어있습니다.</p>
              ) : (
                cart.map(item => (
                  <div key={item.cartKey} className="cart-item">
                    <div className="cart-item-info">
                      <span className="cart-item-name">
                        {item.menuName}
                        {item.selectedOptions.length > 0 && (
                          ` (${item.selectedOptions.map(opt => opt.name).join(', ')})`
                        )}
                      </span>
                      <span className="cart-item-quantity">X {item.quantity}</span>
                    </div>
                    <div className="cart-item-price">
                      {item.totalPrice.toLocaleString()}원
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="cart-summary">
              <div className="total-amount">
                <span className="total-label">총 금액</span>
                <span className="total-price">{getTotalAmount().toLocaleString()}원</span>
              </div>
              <button className="order-button" onClick={handleOrder}>
                주문하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 메뉴 카드 컴포넌트
function MenuCard({ menu, onAddToCart }) {
  const [selectedOptions, setSelectedOptions] = useState([])

  // 옵션 선택/해제
  const toggleOption = (option) => {
    setSelectedOptions(prev => {
      const isSelected = prev.some(opt => opt.id === option.id)
      if (isSelected) {
        return prev.filter(opt => opt.id !== option.id)
      } else {
        return [...prev, option]
      }
    })
  }

  // 현재 가격 계산
  const getCurrentPrice = () => {
    const optionsPrice = selectedOptions.reduce((sum, opt) => sum + opt.price, 0)
    return menu.price + optionsPrice
  }

  // 담기 버튼 클릭
  const handleAddToCart = () => {
    onAddToCart(menu, selectedOptions)
    setSelectedOptions([]) // 옵션 초기화
  }

  return (
    <div className="menu-card">
      {/* 이미지 영역 */}
      <div className="menu-image">
        {menu.imageUrl ? (
          <img src={menu.imageUrl} alt={menu.name} />
        ) : (
          <div className="image-placeholder">
            <span>이미지</span>
          </div>
        )}
      </div>

      {/* 메뉴 정보 */}
      <div className="menu-info">
        <h3 className="menu-name">{menu.name}</h3>
        <p className="menu-price">{getCurrentPrice().toLocaleString()}원</p>
        <p className="menu-description">{menu.description}</p>

        {/* 옵션 */}
        <div className="menu-options">
          {menu.options.map(option => {
            const isSelected = selectedOptions.some(opt => opt.id === option.id)
            return (
              <label key={option.id} className="option-label">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleOption(option)}
                />
                <span>
                  {option.name}
                  {option.price > 0 && ` (+${option.price.toLocaleString()}원)`}
                </span>
              </label>
            )
          })}
        </div>

        {/* 담기 버튼 */}
        <button className="add-button" onClick={handleAddToCart}>
          담기
        </button>
      </div>
    </div>
  )
}

export default App
