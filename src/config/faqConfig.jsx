import React from 'react';
import { Link } from 'react-router-dom';

export const faqConfig = {
  categories: [
    {
      id: 1,
      title: 'Orders & Shipping',
      icon: 'Package',
      path: '/faq/orders-shipping',
      questions: [
        {
          id: 'shipping-1',
          question: 'How does shipping work?',
          answer: 'You choose! Select Local Market-fulfilled shipping, which gives you access to our great rates at the postal carriers, or you can choose to provide your own label.'
        },
        {
          id: 'shipping-2',
          question: 'What are the delivery timeframes?',
          answer: 'Standard shipping typically takes 3-5 business days. Express shipping options are available for faster delivery. All shipments are tracked and insured.'
        },
        {
          id: 'shipping-3',
          question: 'Do you ship internationally?',
          answer: 'Currently, we only ship within Africa. We\'re working on expanding our shipping capabilities to more regions.'
        }
      ]
    },
    {
      id: 2,
      title: 'Payment Methods',
      icon: 'CreditCard',
      path: '/faq/payments',
      questions: [
        {
          id: 'payment-1',
          question: 'When do I get paid?',
          answer: 'Sellers receive payouts directly to their bank account 2 days after the buyer receives the item. This ensures that we can protect against scammers and fraud.'
        },
        {
          id: 'payment-2',
          question: 'What fees do you charge?',
          answer: 'We collect payment processing and platform fees for listings after they have been sold. You can find out more about them here.\n\nWe cover the extra costs of fraud protection and additional processing fees for Affirm (buy now, pay later).'
        },
        {
          id: 'payment-3',
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards, debit cards, and Bitcoin for more secure transactions.'
        }
      ]
    },
    {
      id: 3,
      title: 'Returns & Refunds',
      icon: 'RefreshCw',
      path: '/faq/returns',
      questions: [
        {
          id: 'returns-1',
          question: 'What is your return policy?',
          answer: 'We offer a 30-day return policy for most items. Items must be returned in their original condition with all packaging and accessories.'
        },
        {
          id: 'returns-2',
          question: 'How do I initiate a return?',
          answer: 'To initiate a return, go to your order history, select the item you want to return, and follow the return instructions. We\'ll provide a return shipping label if eligible.'
        }
      ]
    },
    {
      id: 4,
      title: 'Account & Security',
      icon: 'Shield',
      path: '/faq/security',
      questions: [
        {
          id: 'security-1',
          question: 'How am I protected as a Seller?',
          answer: 'A big reason we built Local Market is because we know how frustrating it can be to sell your beloved PC parts online only to get scammed or stuck in a months-long dispute process. We use very strict anti-fraud rules with our payment processor to prevent fraudulent activity.'
        },
        {
          id: 'security-2',
          question: 'How do I become a seller?',
          answer: (
            <>
              For more detailed information about becoming a seller, check out our dedicated page at{' '}
              <Link to="/become-seller" className="text-primary hover:underline">
                become-seller
              </Link>
            </>
          )
        },
        {
          id: 'security-3',
          question: 'Why should I sell on Local Market?',
          answer: '• Sell to a trusted community of local consumers!\n\n• Receive excellent, personalized support to help set you up for success and grow your business.\n\n• Grow your audience'
        },
        {
          id: 'security-4',
          question: 'Can I list my products on other sites?',
          answer: 'Since items listed on Local Market are available for immediate purchase, we ask that you keep your items up to date. If an item becomes unavailable you can send the listing back to your drafts. We also have a Vacation Mode for putting your listings on pause!'
        }
      ]
    }
  ]
}; 