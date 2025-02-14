import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { 
  MailOpen, 
  MessageCircleQuestion, 
  Phone, 
  MapPin, 
  Send, 
  Clock,
  CheckCircle2
} from 'lucide-react';

const Support = () => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });

    // Reset success message after 3 seconds
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Mon-Fri from 8am to 5pm',
      value: '+1 (555) 123-4567'
    },
    {
      icon: MailOpen,
      title: 'Email Support',
      description: '24/7 Response Time',
      value: 'support@localmarket.com'
    },
    {
      icon: MapPin,
      title: 'Office Address',
      description: 'Headquarters',
      value: '123 Market Street, Suite 100, City, State 12345'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      description: 'Customer Service',
      value: 'Monday to Friday: 8am - 5pm'
    }
  ];

  return (
    <div className="min-h-screen bg-background text-text transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-staatliches font-bold mb-4">How Can We Help?</h1>
          <p className="text-textSecondary max-w-2xl mx-auto">
            Our dedicated support team is here to assist you. Feel free to reach out through any of the channels below.
          </p>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
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
              <div className="flex flex-col items-center text-center">
                <div className={`
                  p-3 rounded-xl mb-4
                  ${isDark ? 'bg-white/10' : 'bg-black/5'}
                `}>
                  <info.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{info.title}</h3>
                <p className="text-sm text-textSecondary mb-3">{info.description}</p>
                <p className="text-primary font-medium">{info.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form Section */}
        <div className={`
          max-w-2xl mx-auto rounded-xl border p-8
          ${isDark 
            ? 'bg-cardBg border-white/10' 
            : 'bg-cardBg border-black/10'
          }
        `}>
          <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-textSecondary mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`
                    w-full px-4 py-2 rounded-lg border bg-transparent
                    focus:ring-2 focus:ring-primary focus:border-transparent
                    ${isDark 
                      ? 'border-white/10' 
                      : 'border-black/10'
                    }
                  `}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-textSecondary mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`
                    w-full px-4 py-2 rounded-lg border bg-transparent
                    focus:ring-2 focus:ring-primary focus:border-transparent
                    ${isDark 
                      ? 'border-white/10' 
                      : 'border-black/10'
                    }
                  `}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-2">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className={`
                  w-full px-4 py-2 rounded-lg border bg-transparent
                  focus:ring-2 focus:ring-primary focus:border-transparent
                  ${isDark 
                    ? 'border-white/10' 
                    : 'border-black/10'
                  }
                `}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className={`
                  w-full px-4 py-2 rounded-lg border bg-transparent
                  focus:ring-2 focus:ring-primary focus:border-transparent
                  ${isDark 
                    ? 'border-white/10' 
                    : 'border-black/10'
                  }
                `}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  relative px-6 py-2 rounded-lg font-medium
                  transition-all duration-300
                  ${isSubmitting 
                    ? 'bg-primary/50 cursor-not-allowed' 
                    : 'bg-primary hover:bg-primaryHover'
                  }
                  text-white
                `}
              >
                <span className="flex items-center gap-2">
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </span>
              </button>

              {/* Success Message */}
              {isSuccess && (
                <div className="flex items-center gap-2 text-green-500">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Message sent successfully!</span>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">Need More Help?</h2>
          <p className="text-textSecondary mb-6">
            Check out our frequently asked questions or contact our support team.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/faq"
              className={`
                flex items-center gap-2 px-6 py-3 rounded-lg
                transition-all duration-300
                ${isDark 
                  ? 'bg-white/10 hover:bg-white/20' 
                  : 'bg-black/5 hover:bg-black/10'
                }
              `}
            >
              <MessageCircleQuestion className="w-5 h-5" />
              <span>Visit FAQ</span>
            </a>
            <a
              href="mailto:support@localmarket.com"
              className={`
                flex items-center gap-2 px-6 py-3 rounded-lg
                transition-all duration-300
                ${isDark 
                  ? 'bg-white/10 hover:bg-white/20' 
                  : 'bg-black/5 hover:bg-black/10'
                }
              `}
            >
              <MailOpen className="w-5 h-5" />
              <span>Email Support</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support; 