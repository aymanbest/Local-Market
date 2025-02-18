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

  // Initialize canvas only once
  useEffect(() => {
    if (isInitialized.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    contextRef.current = ctx;
    
    // Set up the scratch-off layer
    ctx.fillStyle = isDark ? '#1e1e1e' : '#f0f0f0';
    ctx.fillRect(0, 0, width, height);
    
    // Add some texture/pattern
    for (let i = 0; i < 5000; i++) {
      ctx.fillStyle = isDark ? '#2a2a2a' : '#e5e5e5';
      ctx.fillRect(
        Math.random() * width,
        Math.random() * height,
        2,
        2
      );
    }

    // Add text
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = isDark ? '#404040' : '#d0d0d0';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch here!', width / 2, height / 2);

    isInitialized.current = true;
  }, [width, height, isDark]);

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX || e.touches[0].clientX) - rect.left) * (width / rect.width);
    const y = ((e.clientY || e.touches[0].clientY) - rect.top) * (height / rect.height);
    return { x, y };
  };

  const scratch = (e) => {
    if (!isDrawing || !contextRef.current) return;

    const { x, y } = getMousePos(e);
    const ctx = contextRef.current;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    // Calculate scratched percentage less frequently
    requestAnimationFrame(() => {
      const imageData = ctx.getImageData(0, 0, width, height);
      let scratched = 0;
      for (let i = 3; i < imageData.data.length; i += 4) {
        if (imageData.data[i] === 0) scratched++;
      }
      scratchedPixels.current = scratched;

      // If more than 50% is scratched, trigger reveal
      if (!isScratched && scratched / totalPixels.current > 0.5) {
        setIsScratched(true);
        onReveal();
      }
    });
  };

  const startDrawing = (e) => {
    e.preventDefault(); // Prevent default touch behavior
    setIsDrawing(true);
    scratch(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  return (
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
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-text mb-3 font-recoleta">Welcome Gift! 🎉</h2>
        <p className="text-textSecondary">
          Scratch the card below to reveal your special welcome discount!
        </p>
      </div>

      {/* Scratch Card Container */}
      <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg mb-8">
        {/* Content underneath */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primaryHover flex items-center justify-center">
          <div className="text-center text-white p-6">
            <div className="mb-4">
              <span className="text-6xl font-bold font-recoleta">{coupon.discountValue}%</span>
            </div>
            <p className="text-lg opacity-90">{coupon.description}</p>
          </div>
        </div>

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
        <div className="animate-slide-up">
          <div className="bg-primary/10 dark:bg-primary/20 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <p className="text-primary font-mono text-xl font-bold">{coupon.code}</p>
              <button
                onClick={handleCopy}
                className="p-2 hover:bg-primary/20 rounded-lg transition-colors"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5 text-primary" />
                )}
              </button>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-full py-3 bg-primary text-white rounded-xl hover:bg-primaryHover transition-colors font-medium"
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
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-primary text-white shadow-lg hover:bg-primaryHover transition-all duration-300 flex items-center justify-center group z-50"
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

export default WelcomeCoupon; 