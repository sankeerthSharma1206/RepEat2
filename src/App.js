import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState('delivery');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderStatus, setOrderStatus] = useState('');
  const [orderProgress, setOrderProgress] = useState(0);
  const [isOrderInProgress, setIsOrderInProgress] = useState(false);
  
  // Sample restaurant data
  const restaurants = [
    {
      id: 1,
      name: "Joe's Pizza",
      rating: 4.5,
      deliveryTime: "25-35 min", 
      deliveryFee: 5.00,
      cuisine: "Italian",
      menu: [
        { id: 101, name: "Margherita Pizza", price: 14.99, description: "Fresh mozzarella, tomatoes, and basil" },
        { id: 102, name: "Pepperoni Pizza", price: 16.99, description: "Classic pepperoni with mozzarella" },
      ]
    },
    {
      id: 2,
      name: "Sushi Express",
      rating: 4.7,
      deliveryTime: "30-40 min",
      deliveryFee: 5.00,
      cuisine: "Japanese",
      menu: [
        { id: 201, name: "California Roll", price: 12.99, description: "Crab, avocado, and cucumber" },
        { id: 202, name: "Dragon Roll", price: 15.99, description: "Eel, avocado, and tempura shrimp" },
      ]
    }
  ];

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      updateQuantity(item.id, existingItem.quantity + 1);
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    setIsCartOpen(true);
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      setCart(cart.filter(item => item.id !== itemId));
    } else {
      setCart(cart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getDeliveryFee = () => {
    return orderType === 'delivery' ? 5.00 : 0;
  };

  const getTax = () => {
    return getSubtotal() * 0.0825; // 8.25% tax
  };

  const getTotal = () => {
    return (getSubtotal() + getDeliveryFee() + getTax()).toFixed(2);
  };

  const handleDeliveryChange = () => {
    if (!isOrderInProgress && window.confirm('Are you sure you want to change to delivery?')) {
      setOrderType('delivery');
      setOrderProgress(50);
      setOrderStatus('Food is ready');
      setIsOrderInProgress(true);
      
      const steps = [
        'Dasher is picking up',
        'Dasher is on the way',
        'Order delivered!'
      ];
      
      let currentStep = 0;
      const interval = setInterval(() => {
        if (currentStep < steps.length) {
          setOrderStatus(steps[currentStep]);
          setOrderProgress(50 + ((currentStep + 1) * (50/steps.length)));
          currentStep++;
        } else {
          clearInterval(interval);
          setIsOrderInProgress(false);
        }
      }, 5000);
    }
  };

  const startOrderTracking = () => {
    setIsCheckingOut(true);
    setOrderProgress(0);
    setIsOrderInProgress(true);
    
    if (orderType === 'delivery') {
      const steps = [
        'Order received',
        'Food being cooked',
        'Dasher is picking up',
        'Dasher is on the way',
        'Order delivered!'
      ];
      
      let currentStep = 0;
      const interval = setInterval(() => {
        if (currentStep < steps.length) {
          setOrderStatus(steps[currentStep]);
          setOrderProgress((currentStep) * (100/(steps.length-1)));
          currentStep++;
        } else {
          clearInterval(interval);
          setIsOrderInProgress(false);
        }
      }, 5000); // 5 seconds each step
      
    } else { // pickup
      const steps = [
        'Order received',
        'Food being cooked',
        'Ready for pickup!'
      ];
      
      let currentStep = 0;
      const interval = setInterval(() => {
        if (currentStep < steps.length) {
          setOrderStatus(steps[currentStep]);
          setOrderProgress((currentStep) * (100/(steps.length-1)));
          currentStep++;
        } else {
          clearInterval(interval);
          setIsOrderInProgress(false);
        }
      }, 5000);
    }
  };

  return (
    <div style={{padding: '20px', backgroundColor: '#f5f5f5'}}>
      <header style={{
        backgroundColor: '#fff',
        padding: '15px',
        marginBottom: '20px',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{margin: 0, color: '#333', fontFamily: 'cursive', background: 'linear-gradient(45deg, #FF4B2B, #FF416C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Rep<span style={{fontSize: '1.2em'}}>EAT</span></h1>
        <nav style={{display: 'flex', gap: '10px'}}>
          <button style={{
            padding: '8px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#eee',
            cursor: isOrderInProgress ? 'not-allowed' : 'pointer',
            opacity: isOrderInProgress ? 0.6 : 1
          }} disabled={isOrderInProgress}>
            <span className="material-icons">search</span>
          </button>
          <button style={{
            padding: '8px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#eee',
            cursor: isOrderInProgress ? 'not-allowed' : 'pointer',
            position: 'relative',
            opacity: isOrderInProgress ? 0.6 : 1
          }} onClick={() => !isOrderInProgress && setIsCartOpen(!isCartOpen)} disabled={isOrderInProgress}>
            <span className="material-icons">shopping_cart</span>
            {cart.length > 0 && <span style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              backgroundColor: '#ff4444',
              color: 'white',
              borderRadius: '50%',
              padding: '2px 6px',
              fontSize: '12px'
            }}>{cart.length}</span>}
          </button>
        </nav>
      </header>

      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '20px'
      }}>
        <button 
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: orderType === 'delivery' ? '#4CAF50' : '#fff',
            color: orderType === 'delivery' ? '#fff' : '#333',
            cursor: isOrderInProgress ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            opacity: isOrderInProgress ? 0.6 : 1
          }}
          onClick={() => !isOrderInProgress && setOrderType('delivery')}
          disabled={isOrderInProgress}
        >
          <span className="material-icons">delivery_dining</span>
          Delivery
        </button>
        <button 
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: orderType === 'pickup' ? '#4CAF50' : '#fff',
            color: orderType === 'pickup' ? '#fff' : '#333',
            cursor: isOrderInProgress ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            opacity: isOrderInProgress ? 0.6 : 1
          }}
          onClick={() => !isOrderInProgress && setOrderType('pickup')}
          disabled={isOrderInProgress}
        >
          <span className="material-icons">store</span>
          Pickup
        </button>
      </div>

      <main style={{padding: '20px'}}>
        <section>
          <h2 style={{marginBottom: '20px', color: '#333'}}>Popular Near You</h2>
          <div style={{display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'}}>
            {restaurants.map(restaurant => (
              <div key={restaurant.id} style={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                padding: '15px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{
                  backgroundColor: '#eee',
                  height: '150px',
                  borderRadius: '4px',
                  marginBottom: '15px',
                  position: 'relative'
                }}>
                  <span style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: '#fff',
                    padding: '5px 10px',
                    borderRadius: '4px'
                  }}>{restaurant.deliveryTime}</span>
                </div>
                <div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px'
                  }}>
                    <h3 style={{margin: 0}}>{restaurant.name}</h3>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#ffc107'
                    }}>
                      <span className="material-icons">star</span>
                      {restaurant.rating}
                    </span>
                  </div>
                  <p style={{color: '#666', margin: '5px 0'}}>{restaurant.cuisine}</p>
                  <p style={{color: '#666', margin: '5px 0'}}>
                    Delivery: ${restaurant.deliveryFee.toFixed(2)}
                  </p>
                  
                  <div style={{marginTop: '15px'}}>
                    {restaurant.menu.map(item => (
                      <div key={item.id} style={{
                        backgroundColor: '#f8f8f8',
                        borderRadius: '4px',
                        padding: '10px',
                        marginBottom: '10px'
                      }}>
                        <div style={{marginLeft: '10px'}}>
                          <h4 style={{margin: '0 0 5px 0'}}>{item.name}</h4>
                          <p style={{margin: '0 0 10px 0', color: '#666'}}>{item.description}</p>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <p style={{margin: 0, fontWeight: 'bold'}}>${item.price}</p>
                            <button 
                              style={{
                                backgroundColor: '#4CAF50',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '8px 16px',
                                cursor: isOrderInProgress ? 'not-allowed' : 'pointer',
                                opacity: isOrderInProgress ? 0.6 : 1
                              }}
                              onClick={() => !isOrderInProgress && addToCart(item)}
                              disabled={isOrderInProgress}
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {isCartOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            maxWidth: '400px',
            backgroundColor: '#fff',
            boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
            padding: '20px',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{margin: 0}}>Your Order</h2>
              <button style={{
                border: 'none',
                background: 'none',
                cursor: isOrderInProgress ? 'not-allowed' : 'pointer',
                opacity: isOrderInProgress ? 0.6 : 1
              }} onClick={() => !isOrderInProgress && setIsCartOpen(false)} disabled={isOrderInProgress}>
                <span className="material-icons">close</span>
              </button>
            </div>
            
            {cart.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 0',
                color: '#666'
              }}>
                <span className="material-icons" style={{fontSize: '48px'}}>shopping_cart</span>
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>
                <div style={{marginBottom: '20px'}}>
                  {cart.map(item => (
                    <div key={item.id} style={{
                      display: 'flex',
                      padding: '10px',
                      borderBottom: '1px solid #eee',
                      gap: '10px'
                    }}>
                      <div style={{flex: 1}}>
                        <h4 style={{margin: '0 0 5px 0'}}>{item.name}</h4>
                        <p style={{margin: '0 0 10px 0'}}>${(item.price * item.quantity).toFixed(2)}</p>
                        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                          <button style={{
                            border: 'none',
                            backgroundColor: '#eee',
                            borderRadius: '4px',
                            padding: '4px',
                            cursor: isOrderInProgress ? 'not-allowed' : 'pointer',
                            opacity: isOrderInProgress ? 0.6 : 1
                          }} onClick={() => !isOrderInProgress && updateQuantity(item.id, item.quantity - 1)} disabled={isOrderInProgress}>
                            <span className="material-icons">remove</span>
                          </button>
                          <span>{item.quantity}</span>
                          <button style={{
                            border: 'none',
                            backgroundColor: '#eee',
                            borderRadius: '4px',
                            padding: '4px',
                            cursor: isOrderInProgress ? 'not-allowed' : 'pointer',
                            opacity: isOrderInProgress ? 0.6 : 1
                          }} onClick={() => !isOrderInProgress && updateQuantity(item.id, item.quantity + 1)} disabled={isOrderInProgress}>
                            <span className="material-icons">add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div style={{borderTop: '1px solid #eee', paddingTop: '20px'}}>
                  <div style={{marginBottom: '20px'}}>
                    <h4 style={{marginBottom: '10px'}}>Order Type</h4>
                    <div style={{display: 'flex', gap: '10px'}}>
                      <button 
                        style={{
                          flex: 1,
                          padding: '10px',
                          border: 'none',
                          borderRadius: '4px',
                          backgroundColor: orderType === 'delivery' ? '#4CAF50' : '#eee',
                          color: orderType === 'delivery' ? '#fff' : '#333',
                          cursor: isOrderInProgress ? 'not-allowed' : 'pointer',
                          opacity: isOrderInProgress ? 0.6 : 1
                        }}
                        onClick={() => !isOrderInProgress && setOrderType('delivery')}
                        disabled={isOrderInProgress}
                      >
                        Delivery
                      </button>
                      <button 
                        style={{
                          flex: 1,
                          padding: '10px',
                          border: 'none',
                          borderRadius: '4px',
                          backgroundColor: orderType === 'pickup' ? '#4CAF50' : '#eee',
                          color: orderType === 'pickup' ? '#fff' : '#333',
                          cursor: isOrderInProgress ? 'not-allowed' : 'pointer',
                          opacity: isOrderInProgress ? 0.6 : 1
                        }}
                        onClick={() => !isOrderInProgress && setOrderType('pickup')}
                        disabled={isOrderInProgress}
                      >
                        Pickup
                      </button>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    margin: '10px 0'
                  }}>
                    <span>Subtotal</span>
                    <span>${getSubtotal().toFixed(2)}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    margin: '10px 0'
                  }}>
                    <span>{orderType === 'delivery' ? 'Delivery Fee' : 'Pickup Fee'}</span>
                    <span>${getDeliveryFee().toFixed(2)}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    margin: '10px 0'
                  }}>
                    <span>Tax</span>
                    <span>${getTax().toFixed(2)}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    margin: '15px 0',
                    fontWeight: 'bold',
                    fontSize: '1.2em'
                  }}>
                    <span>Total</span>
                    <span>${getTotal()}</span>
                  </div>
                  
                  <button 
                    style={{
                      width: '100%',
                      padding: '15px',
                      backgroundColor: '#4CAF50',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: isOrderInProgress ? 'not-allowed' : 'pointer',
                      fontSize: '16px',
                      marginBottom: '20px',
                      opacity: isOrderInProgress ? 0.6 : 1
                    }}
                    onClick={startOrderTracking}
                    disabled={isOrderInProgress}
                  >
                    Place Order
                  </button>

                  {isCheckingOut && (
                    <div style={{
                      backgroundColor: '#fff',
                      padding: '20px',
                      borderRadius: '8px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                      marginTop: '20px'
                    }}>
                      <h3>Order Status</h3>
                      <div style={{
                        width: '100%',
                        height: '8px',
                        backgroundColor: '#eee',
                        borderRadius: '4px',
                        marginTop: '20px',
                        position: 'relative'
                      }}>
                        <div style={{
                          position: 'absolute',
                          left: `${orderProgress}%`,
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '16px',
                          height: '16px',
                          backgroundColor: '#4CAF50',
                          borderRadius: '50%',
                          transition: 'left 0.5s ease-in-out'
                        }}></div>
                      </div>
                      <p style={{textAlign: 'center', marginTop: '20px'}}>{orderStatus}</p>

                      {orderType === 'pickup' && orderStatus === 'Ready for pickup!' && (
                        <div style={{marginTop: '20px', textAlign: 'center'}}>
                          <button 
                            style={{
                              padding: '10px 20px',
                              backgroundColor: '#FF9800',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: isOrderInProgress ? 'not-allowed' : 'pointer',
                              marginBottom: '10px',
                              opacity: isOrderInProgress ? 0.6 : 1
                            }}
                            onClick={handleDeliveryChange}
                            disabled={isOrderInProgress}
                          >
                            Change to Delivery
                          </button>
                          <p style={{
                            color: '#666',
                            fontSize: '0.9em',
                            fontStyle: 'italic'
                          }}>
                            Note: Delivery charges will be applied and delivery time cannot be guaranteed for this change.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
