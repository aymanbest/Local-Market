import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { 
  Leaf, 
  ShieldCheck, 
  Users, 
  Truck, 
  Store, 
  Heart,
  Award,
  Sprout,
  Target,
  TrendingUp
} from 'lucide-react';

const About = () => {
  const { isDark } = useTheme();

  const features = [
    {
      icon: ShieldCheck,
      title: 'Secure Platform',
      description: 'Advanced security measures to protect your transactions and data.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Built by and for local producers and consumers.'
    },
    {
      icon: Truck,
      title: 'Local Delivery',
      description: 'Fast and reliable delivery service for your local purchases.'
    },
    {
      icon: Store,
      title: 'Local Businesses',
      description: 'Supporting small businesses and local entrepreneurs.'
    }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Community First',
      description: 'We prioritize building strong, lasting relationships within our local communities.'
    },
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'We maintain high standards for all products and services on our platform.'
    },
    {
      icon: Sprout,
      title: 'Sustainability',
      description: 'Promoting eco-friendly practices and sustainable local commerce.'
    },
    {
      icon: Target,
      title: 'Transparency',
      description: 'Open and honest communication with all our stakeholders.'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '500+', label: 'Local Producers' },
    { value: '50K+', label: 'Products Delivered' },
    { value: '95%', label: 'Satisfaction Rate' }
  ];

  return (
    <div className="min-h-screen bg-background text-text transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 rotate-45 bg-gradient-to-r from-primary/50 to-transparent rounded-lg blur-lg"></div>
              <Leaf className="w-16 h-16 text-primary relative z-10" />
            </div>
          </div>
          <h1 className="text-5xl font-staatliches font-bold mb-6">About LocalMarket</h1>
          <p className="text-xl text-textSecondary max-w-3xl mx-auto leading-relaxed">
            Connecting local producers with their community through a modern, secure, and user-friendly marketplace.
          </p>
        </div>

        {/* Stats Section */}
        <div className={`
          rounded-2xl border mb-20 py-12 px-6
          ${isDark 
            ? 'bg-cardBg border-white/10' 
            : 'bg-cardBg border-black/10'
          }
        `}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-textSecondary">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
            <p className="text-textSecondary max-w-3xl mx-auto leading-relaxed">
              To revolutionize local commerce by providing a digital platform that empowers producers 
              and delivers quality products to consumers while strengthening community bonds.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`
                  p-6 rounded-xl border transition-all duration-300
                  ${isDark 
                    ? 'bg-cardBg border-white/10 hover:bg-white/5' 
                    : 'bg-cardBg border-black/10 hover:bg-black/5'
                  }
                `}
              >
                <div className={`
                  p-3 rounded-xl mb-4 w-max
                  ${isDark ? 'bg-white/10' : 'bg-black/5'}
                `}>
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-textSecondary">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-4">Our Values</h2>
            <p className="text-textSecondary max-w-3xl mx-auto leading-relaxed">
              The principles that guide us in building a better marketplace for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className={`
                  p-6 rounded-xl border transition-all duration-300
                  ${isDark 
                    ? 'bg-cardBg border-white/10 hover:bg-white/5' 
                    : 'bg-cardBg border-black/10 hover:bg-black/5'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`
                    p-3 rounded-xl
                    ${isDark ? 'bg-white/10' : 'bg-black/5'}
                  `}>
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                    <p className="text-textSecondary">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Section */}
        <div className={`
          rounded-2xl border p-8 text-center
          ${isDark 
            ? 'bg-cardBg border-white/10' 
            : 'bg-cardBg border-black/10'
          }
        `}>
          <div className="flex justify-center mb-6">
            <div className={`
              p-4 rounded-xl
              ${isDark ? 'bg-white/10' : 'bg-black/5'}
            `}>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl font-semibold mb-4">Growing Together</h2>
          <p className="text-textSecondary max-w-2xl mx-auto mb-8">
            Join us in our journey to create a thriving ecosystem where local businesses flourish 
            and communities prosper.
          </p>
          <a
            href="/become-seller"
            className="
              inline-flex items-center gap-2 px-6 py-3 rounded-lg
              bg-primary hover:bg-primaryHover text-white
              transition-all duration-300
            "
          >
            <Store className="w-5 h-5" />
            <span>Become a Seller</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default About; 