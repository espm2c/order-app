import { useState, useMemo, useEffect } from 'react'
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

// 재고 현황에 표시할 메뉴 3개 (처음 3개)
const STOCK_MENUS = MENU_DATA.slice(0, 3)

function App() {
  const [currentView, setCurrentView] = useState('order') // 'order' or 'admin'
  const [cart, setCart] = useState([])
  const [orders, setOrders] = useState(() => {
    // localStorage에서 주문 데이터 불러오기
    const savedOrders = localStorage.getItem('orders')
    return savedOrders ? JSON.parse(savedOrders) : []
  })
  const [stocks, setStocks] = useState(() => {
    // localStorage에서 재고 데이터 불러오기
    const savedStocks = localStorage.getItem('stocks')
    if (savedStocks) {
      return JSON.parse(savedStocks)
    }
    return STOCK_MENUS.map(menu => ({ menuId: menu.id, menuName: menu.name, stock: 10 }))
  })

  // localStorage에 주문 데이터 저장
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders))
  }, [orders])

  // localStorage에 재고 데이터 저장
  useEffect(() => {
    localStorage.setItem('stocks', JSON.stringify(stocks))
  }, [stocks])

  // 장바구니 아이템 제거
  const removeFromCart = (cartKey) => {
    setCart(prev => prev.filter(item => item.cartKey !== cartKey))
  }

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

  // 총 금액 계산 (성능 최적화)
  const totalAmount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.totalPrice, 0)
  }, [cart])

  // 주문하기
  const handleOrder = () => {
    if (cart.length === 0) {
      alert('장바구니가 비어있습니다.')
      return
    }

    const orderData = {
      id: Date.now(), // 임시 ID
      orderTime: new Date().toISOString(),
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
      totalAmount: totalAmount,
      status: 'received' // 주문이 들어오면 처음에는 '주문 접수' 상태
    }

    // 주문 목록에 추가
    setOrders(prev => [orderData, ...prev])
    console.log('주문 데이터:', orderData)
    alert(`주문이 완료되었습니다!\n총 금액: ${totalAmount.toLocaleString()}원`)
    setCart([])
  }

  // 재고 증가
  const increaseStock = (menuId) => {
    setStocks(prev => 
      prev.map(stock => 
        stock.menuId === menuId 
          ? { ...stock, stock: stock.stock + 1 }
          : stock
      )
    )
  }

  // 재고 감소
  const decreaseStock = (menuId) => {
    setStocks(prev => 
      prev.map(stock => 
        stock.menuId === menuId && stock.stock > 0
          ? { ...stock, stock: stock.stock - 1 }
          : stock
      )
    )
  }

  // 주문 상태 변경
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    )
  }

  // 대시보드 통계 계산 (성능 최적화)
  const dashboardStats = useMemo(() => {
    const totalOrders = orders.length
    const receivedOrders = orders.filter(o => o.status === 'received').length
    const inProductionOrders = orders.filter(o => o.status === 'in_production').length
    const completedOrders = orders.filter(o => o.status === 'completed').length
    return { totalOrders, receivedOrders, inProductionOrders, completedOrders }
  }, [orders])

  return (
    <div className="app">
      {/* 헤더 */}
      <header className="header">
        <div className="logo">COZY</div>
        <div className="header-buttons">
          <button 
            className={`nav-button ${currentView === 'order' ? 'active' : ''}`}
            onClick={() => setCurrentView('order')}
          >
            주문하기
          </button>
          <button 
            className={`nav-button ${currentView === 'admin' ? 'active' : ''}`}
            onClick={() => setCurrentView('admin')}
          >
            관리자
          </button>
        </div>
      </header>

      {/* 화면 전환 */}
      {currentView === 'order' ? (
        <>
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
                        <div className="cart-item-actions">
                          <div className="cart-item-price">
                            {item.totalPrice.toLocaleString()}원
                          </div>
                          <button 
                            className="cart-item-remove"
                            onClick={() => removeFromCart(item.cartKey)}
                            aria-label="장바구니에서 제거"
                            title="제거"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="cart-summary">
                  <div className="total-amount">
                    <span className="total-label">총 금액</span>
                    <span className="total-price">{totalAmount.toLocaleString()}원</span>
                  </div>
                  <button className="order-button" onClick={handleOrder}>
                    주문하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <AdminView
          stocks={stocks}
          orders={orders}
          onIncreaseStock={increaseStock}
          onDecreaseStock={decreaseStock}
          onUpdateOrderStatus={updateOrderStatus}
          dashboardStats={dashboardStats}
        />
      )}
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

// 관리자 화면 컴포넌트
function AdminView({ stocks, orders, onIncreaseStock, onDecreaseStock, onUpdateOrderStatus, dashboardStats }) {
  return (
    <main className="admin-content">
      {/* 관리자 대시보드 */}
      <section className="admin-section">
        <h2 className="section-title">관리자 대시보드</h2>
        <div className="dashboard-stats">
          <div className="stat-item">
            <span className="stat-label">총 주문</span>
            <span className="stat-value">{dashboardStats.totalOrders}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">주문 접수</span>
            <span className="stat-value">{dashboardStats.receivedOrders}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">제조 중</span>
            <span className="stat-value">{dashboardStats.inProductionOrders}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">제조 완료</span>
            <span className="stat-value">{dashboardStats.completedOrders}</span>
          </div>
        </div>
      </section>

      {/* 재고 현황 */}
      <section className="admin-section">
        <h2 className="section-title">재고 현황</h2>
        <div className="stock-container">
          {stocks.map(stock => {
            const getStockStatus = () => {
              if (stock.stock === 0) return { text: '품절', color: '#ef4444' }
              if (stock.stock < 5) return { text: '주의', color: '#f59e0b' }
              return { text: '정상', color: '#10b981' }
            }
            const status = getStockStatus()
            
            return (
              <div key={stock.menuId} className="stock-card">
                <div className="stock-info">
                  <h3 className="stock-menu-name">{stock.menuName}</h3>
                  <div className="stock-details">
                    <span className="stock-quantity">{stock.stock}개</span>
                    <span className="stock-status" style={{ color: status.color }}>
                      {status.text}
                    </span>
                  </div>
                </div>
                <div className="stock-controls">
                  <button 
                    className="stock-button decrease"
                    onClick={() => onDecreaseStock(stock.menuId)}
                    disabled={stock.stock === 0}
                  >
                    -
                  </button>
                  <button 
                    className="stock-button increase"
                    onClick={() => onIncreaseStock(stock.menuId)}
                  >
                    +
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 주문 현황 */}
      <section className="admin-section">
        <h2 className="section-title">주문 현황</h2>
        <div className="orders-container">
          {orders.length === 0 ? (
            <p className="empty-orders">주문이 없습니다.</p>
          ) : (
            orders.map(order => {
              const orderDate = new Date(order.orderTime)
              const formattedDate = `${orderDate.getMonth() + 1}월 ${orderDate.getDate()}일 ${orderDate.getHours()}:${String(orderDate.getMinutes()).padStart(2, '0')}`
              
              return (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <span className="order-time">{formattedDate}</span>
                    <span className={`order-status-badge status-${order.status}`}>
                      {order.status === 'pending' && '주문 접수'}
                      {order.status === 'received' && '주문 접수'}
                      {order.status === 'in_production' && '제조 중'}
                      {order.status === 'completed' && '제조 완료'}
                    </span>
                  </div>
                  <div className="order-items">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="order-item">
                        <span className="order-item-name">
                          {item.menuName}
                          {item.options.length > 0 && (
                            ` (${item.options.map(opt => opt.optionName).join(', ')})`
                          )}
                        </span>
                        <span className="order-item-quantity">X {item.quantity}</span>
                        <span className="order-item-price">{(item.price * item.quantity).toLocaleString()}원</span>
                      </div>
                    ))}
                  </div>
                  <div className="order-footer">
                    <span className="order-total">총 {order.totalAmount.toLocaleString()}원</span>
                    {order.status === 'pending' && (
                      <button 
                        className="order-action-button"
                        onClick={() => onUpdateOrderStatus(order.id, 'received')}
                      >
                        주문 접수
                      </button>
                    )}
                    {order.status === 'received' && (
                      <button 
                        className="order-action-button"
                        onClick={() => onUpdateOrderStatus(order.id, 'in_production')}
                      >
                        제조 시작
                      </button>
                    )}
                    {order.status === 'in_production' && (
                      <button 
                        className="order-action-button"
                        onClick={() => onUpdateOrderStatus(order.id, 'completed')}
                      >
                        제조 완료
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </section>
    </main>
  )
}

export default App
