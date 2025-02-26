import React, { useState, useEffect, useRef } from 'react';
import { BadgePercent, X, Copy, Check } from 'lucide-react';
import api from '../../../lib/axios';
import { useTheme } from '../../../context/ThemeContext';
import { useSelector } from 'react-redux';

const ScratchCard = ({ onReveal, width = 300, height = 200, children }) => {
  const canvasRef = useRef(null);
  const [isScratched, setIsScratched] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const { isDark } = useTheme();
  const scratchedPixels = useRef(0);
  const totalPixels = useRef(width * height);
  const contextRef = useRef(null);
  const isInitialized = useRef(false);
  const lastPoint = useRef(null);
  const [progress, setProgress] = useState(0);

  // Initialize canvas and sound effect
  useEffect(() => {
    if (isInitialized.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    contextRef.current = ctx;
    
    // Create a pattern for the scratch-off layer
    const patternCanvas = document.createElement('canvas');
    const patternCtx = patternCanvas.getContext('2d');
    patternCanvas.width = 100;
    patternCanvas.height = 100;
    
    // Create a subtle pattern
    patternCtx.fillStyle = isDark ? '#1e1e1e' : '#f0f0f0';
    patternCtx.fillRect(0, 0, 100, 100);
    
    // Add some texture/pattern
    for (let i = 0; i < 500; i++) {
      patternCtx.fillStyle = isDark ? 
        `rgba(42, 42, 42, ${Math.random() * 0.5 + 0.5})` : 
        `rgba(229, 229, 229, ${Math.random() * 0.5 + 0.5})`;
      
      patternCtx.beginPath();
      patternCtx.arc(
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 2 + 1,
        0,
        Math.PI * 2
      );
      patternCtx.fill();
    }
    
    // Create diagonal lines for texture
    patternCtx.strokeStyle = isDark ? '#2a2a2a' : '#e5e5e5';
    patternCtx.lineWidth = 1;
    for (let i = 0; i < 20; i++) {
      patternCtx.beginPath();
      patternCtx.moveTo(0, i * 5);
      patternCtx.lineTo(100, i * 5);
      patternCtx.stroke();
    }
    
    const pattern = ctx.createPattern(patternCanvas, 'repeat');
    
    // Set up the scratch-off layer with the pattern
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, width, height);
    
    // Add a border to the scratch area
    ctx.strokeStyle = isDark ? '#333333' : '#dddddd';
    ctx.lineWidth = 3;
    ctx.strokeRect(2, 2, width - 4, height - 4);
    
    // Add shine effect
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.3)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0)');
    gradient.addColorStop(1, isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.3)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add text and icon
    ctx.font = 'bold 22px Arial, sans-serif';
    ctx.fillStyle = isDark ? '#505050' : '#b0b0b0';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch here to reveal', width / 2, height / 2 - 10);
    
    // Draw a simple scratch icon
    ctx.beginPath();
    ctx.moveTo(width / 2 - 30, height / 2 + 20);
    ctx.lineTo(width / 2 + 30, height / 2 + 20);
    ctx.lineWidth = 3;
    ctx.strokeStyle = isDark ? '#505050' : '#b0b0b0';
    ctx.stroke();
    
    // Draw arrow indicators
    const arrowSize = 8;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 30 - arrowSize, height / 2 + 20);
    ctx.lineTo(width / 2 - 30, height / 2 + 20 - arrowSize);
    ctx.lineTo(width / 2 - 30, height / 2 + 20 + arrowSize);
    ctx.closePath();
    ctx.fillStyle = isDark ? '#505050' : '#b0b0b0';
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(width / 2 + 30 + arrowSize, height / 2 + 20);
    ctx.lineTo(width / 2 + 30, height / 2 + 20 - arrowSize);
    ctx.lineTo(width / 2 + 30, height / 2 + 20 + arrowSize);
    ctx.closePath();
    ctx.fill();

    isInitialized.current = true;
  }, [width, height, isDark]);

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX || (e.touches && e.touches[0]?.clientX)) - rect.left) * (width / rect.width);
    const y = ((e.clientY || (e.touches && e.touches[0]?.clientY)) - rect.top) * (height / rect.height);
    return { x, y };
  };

  const scratch = (e) => {
    if (!isDrawing || !contextRef.current) return;

    const { x, y } = getMousePos(e);
    if (!x || !y) return; // Guard against undefined coordinates
    
    const ctx = contextRef.current;
    ctx.globalCompositeOperation = 'destination-out';
    
    // Create a more natural scratch effect with varying line width
    if (lastPoint.current) {
      const lastX = lastPoint.current.x;
      const lastY = lastPoint.current.y;
      
      // Calculate distance for dynamic brush size
      const distance = Math.sqrt(Math.pow(x - lastX, 2) + Math.pow(y - lastY, 2));
      const brushSize = Math.max(15, 25 - distance * 0.5); // Smaller brush for faster movements
      
      // Draw a line from last point to current point
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
      
      // Add some particles for a more realistic effect
      for (let i = 0; i < 3; i++) {
        const particleX = lastX + (x - lastX) * (i / 3);
        const particleY = lastY + (y - lastY) * (i / 3);
        ctx.beginPath();
        ctx.arc(
          particleX + (Math.random() - 0.5) * 10,
          particleY + (Math.random() - 0.5) * 10,
          Math.random() * 5 + 2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }
    
    // Also draw a circle at the current point for better coverage
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();
    
    lastPoint.current = { x, y };

    // Calculate scratched percentage less frequently
    requestAnimationFrame(() => {
      const imageData = ctx.getImageData(0, 0, width, height);
      let scratched = 0;
      for (let i = 3; i < imageData.data.length; i += 4) {
        if (imageData.data[i] === 0) scratched++;
      }
      scratchedPixels.current = scratched;
      const newProgress = Math.floor((scratched / totalPixels.current) * 100);
      setProgress(newProgress);

      // If more than 40% is scratched, trigger reveal
      if (!isScratched && scratched / totalPixels.current > 0.4) {
        setIsScratched(true);
        onReveal();
        
        // Animate the complete reveal
        const revealAnimation = () => {
          const currentProgress = scratchedPixels.current / totalPixels.current;
          if (currentProgress < 0.98) {
            // Clear more of the scratch area in a circular pattern
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.max(width, height) * Math.sqrt(currentProgress + 0.02);
            
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Update scratched pixels
            const imageData = ctx.getImageData(0, 0, width, height);
            let newScratched = 0;
            for (let i = 3; i < imageData.data.length; i += 4) {
              if (imageData.data[i] === 0) newScratched++;
            }
            scratchedPixels.current = newScratched;
            setProgress(Math.floor((newScratched / totalPixels.current) * 100));
            
            requestAnimationFrame(revealAnimation);
          }
        };
        
        requestAnimationFrame(revealAnimation);
      }
    });
  };

  const startDrawing = (e) => {
    e.preventDefault(); // Prevent default touch behavior
    setIsDrawing(true);
    lastPoint.current = null; // Reset last point
    scratch(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPoint.current = null;
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={startDrawing}
        onMouseMove={scratch}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={(e) => {
          e.preventDefault(); // Prevent scrolling while scratching
          scratch(e);
        }}
        onTouchEnd={stopDrawing}
        className="absolute inset-0 touch-none cursor-pointer"
        style={{ width: '100%', height: '100%' }}
      />
      {/* Progress indicator */}
      {progress > 0 && progress < 40 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center">
          <div className="bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-medium">
            {progress}% revealed
          </div>
        </div>
      )}
    </>
  );
};

// Modal Component to prevent re-renders
const Modal = React.memo(({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-[#0a0a0a]/80" 
        onClick={onClose}
      />
      {/* Modal Content */}
      <div className="relative bg-white dark:bg-[#1a1a1a] rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-8 h-8 bg-white dark:bg-[#1a1a1a] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
        >
          <X className="w-5 h-5 text-primary" />
        </button>
        {children}
      </div>
    </div>
  );
});

const WelcomeCoupon = () => {
  const [coupon, setCoupon] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [copied, setCopied] = useState(false);
  const { isDark } = useTheme();
  const { isAuthenticated } = useSelector(state => state.auth);
  const location = window.location.pathname;

  // Add check for admin and producer paths
  const isAdminOrProducer = location.startsWith('/admin') || location.startsWith('/producer');

  useEffect(() => {
    const checkWelcomeCoupon = async () => {
      if (!isAuthenticated || isChecked || isAdminOrProducer) return;
      
      try {
        const response = await api.get('/api/coupons/check-welcome');
        // Only set coupon if we have a valid couponId
        if (response.data?.couponId) {
          setCoupon(response.data);
        }
        setIsChecked(true);
      } catch (error) {
        console.error('Error checking welcome coupon:', error);
        setIsChecked(true);
      }
    };

    checkWelcomeCoupon();
  }, [isChecked, isAuthenticated, isAdminOrProducer]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Update the condition to include isAdminOrProducer check
  if (!isAuthenticated || !coupon || (isChecked && !coupon) || isAdminOrProducer) return null;

  const modalContent = (
    <>
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-text mb-2 font-recoleta">Welcome Gift! 🎉</h2>
        <p className="text-textSecondary">
          Scratch the card below to reveal your special welcome discount!
        </p>
      </div>

      {/* Scratch Card Container */}
      <div className="relative h-64 rounded-2xl overflow-hidden shadow-xl mb-6 transform transition-all duration-500">
        {/* Content underneath */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primaryHover flex items-center justify-center">
          <div className={`text-center text-white p-6 transition-all duration-700 ${isRevealed ? 'scale-110 opacity-100' : 'scale-100 opacity-90'}`}>
            <div className="mb-3">
              <span className="text-7xl font-bold font-recoleta">{coupon.discountValue}%</span>
              <span className="text-2xl font-bold ml-1">OFF</span>
            </div>
            <p className="text-lg opacity-90 max-w-[250px] mx-auto">{coupon.description}</p>
          </div>
        </div>

        {/* Confetti effect when revealed */}
        {isRevealed && (
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ['#FF5555', '#FFCC00', '#33CC99', '#3399FF', '#CC66FF'][i % 5],
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  transform: `scale(${Math.random() + 0.5})`,
                  opacity: Math.random() * 0.7 + 0.3,
                  animation: `fall-${i % 5} ${Math.random() * 3 + 2}s linear forwards`
                }}
              />
            ))}
          </div>
        )}

        {/* Scratch layer */}
        {!isRevealed && (
          <ScratchCard
            onReveal={() => setIsRevealed(true)}
            width={400}
            height={256}
          />
        )}
      </div>

      {/* Revealed Content */}
      {isRevealed && (
        <div className="animate-fade-in-up">
          <div className="bg-primary/10 dark:bg-primary/20 rounded-xl p-4 mb-4 border border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <p className="text-primary font-mono text-xl font-bold tracking-wider">{coupon.code}</p>
                <p className="text-xs text-textSecondary mt-1">Copy and use at checkout</p>
              </div>
              <button
                onClick={handleCopy}
                className={`p-2 rounded-lg transition-all duration-300 ${copied ? 'bg-green-500/20 text-green-500' : 'hover:bg-primary/20 text-primary'}`}
              >
                {copied ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-full py-3 bg-primary text-white rounded-xl hover:bg-primaryHover transition-colors font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Start Shopping!
          </button>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-primary text-white shadow-lg hover:bg-primaryHover transition-all duration-300 flex items-center justify-center group z-50 hover:scale-110"
        >
          <div className="absolute animate-spin-slow">
            <BadgePercent className="w-8 h-8" />
          </div>
          <div className="absolute right-full mr-3 bg-white dark:bg-[#1a1a1a] text-primary px-4 py-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-medium">
            Scratch & Win! 🎁
          </div>
        </button>
      )}

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {modalContent}
      </Modal>
    </>
  );
};

// Add keyframe animations for confetti
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fall-0 {
    0% { transform: translateY(-10px) rotate(0deg); opacity: 0; }
    10% { opacity: 1; }
    100% { transform: translateY(400px) rotate(360deg); opacity: 0; }
  }
  @keyframes fall-1 {
    0% { transform: translateY(-10px) rotate(0deg); opacity: 0; }
    10% { opacity: 1; }
    100% { transform: translateY(400px) rotate(-360deg); opacity: 0; }
  }
  @keyframes fall-2 {
    0% { transform: translateY(-10px) rotate(0deg); opacity: 0; }
    10% { opacity: 1; }
    100% { transform: translateY(400px) rotate(720deg); opacity: 0; }
  }
  @keyframes fall-3 {
    0% { transform: translateY(-10px) rotate(0deg); opacity: 0; }
    10% { opacity: 1; }
    100% { transform: translateY(400px) rotate(-720deg); opacity: 0; }
  }
  @keyframes fall-4 {
    0% { transform: translateY(-10px) rotate(0deg); opacity: 0; }
    10% { opacity: 1; }
    100% { transform: translateY(400px) rotate(1080deg); opacity: 0; }
  }
  
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fade-in-up {
    animation: fade-in-up 0.6s ease-out forwards;
  }
`;
document.head.appendChild(styleSheet);

export default WelcomeCoupon; 