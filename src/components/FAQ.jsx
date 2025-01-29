import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { HelpCircle, ChevronRight, ShoppingBag, CreditCard, Truck, Package, RefreshCw, Shield } from 'lucide-react';
import { faqConfig } from '../config/faqConfig.jsx';
import * as lucideIcons from 'lucide-react';

const FAQ = () => {
  const { category } = useParams();
  const selectedCategory = category 
    ? faqConfig.categories.find(cat => cat.path === `/faq/${category}`)
    : null;

  return (
    <div className="min-h-screen bg-background text-text transition-colors duration-300">
      <div className="container flex flex-col md:flex-row gap-6 p-4 max-w-7xl mx-auto">
        {/* Sidebar */}
        <div className="card rounded-xl md:w-80 h-max md:sticky top-4 shrink-0 bg-cardBg border border-cardBorder">
          <h3 className="p-4 text-text font-medium">FAQ Categories</h3>
          <hr className="border-cardBorder" />
          <ul className="py-4 space-y-2">
            {faqConfig.categories.map((cat) => (
              <li key={cat.id} className="px-4 relative text-sm">
                <Link
                  to={cat.path}
                  className="bg-cardBg hover:bg-white/5 rounded-lg p-2 flex items-center gap-2 transition-colors duration-300 group"
                >
                  <div className="p-1 bg-primary/10 rounded-lg">
                    {React.createElement(lucideIcons[cat.icon], {
                      className: "w-5 h-5 text-primary"
                    })}
                  </div>
                  <span className="text-text">{cat.title}</span>
                  <ChevronRight className="w-4 h-4 ml-auto text-textSecondary group-hover:text-primary transition-colors" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h2 className="text-4xl font-bold mb-8 font-recoleta">
            {selectedCategory ? (
              <>
                <span className="text-primary">{selectedCategory.title}</span> FAQ
              </>
            ) : (
              <>
                Frequently Asked <span className="text-primary">Questions</span>
              </>
            )}
          </h2>

          <div className="space-y-4">
            {selectedCategory ? (
              // Show only selected category questions
              <div className="space-y-4">
                {selectedCategory.questions.map((faq) => (
                  <details key={faq.id} className="group">
                    <summary className="flex items-center justify-between p-4 rounded-lg bg-cardBg border border-cardBorder cursor-pointer">
                      <div className="flex items-center gap-3">
                        <HelpCircle className="w-5 h-5 text-primary" />
                        <span className="font-medium">{faq.question}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
                    </summary>
                    <div className="p-4 mt-2 bg-cardBg rounded-lg border border-cardBorder">
                      <div className="prose prose-invert max-w-none">
                        {typeof faq.answer === 'string' 
                          ? faq.answer.split('\n').map((paragraph, index) => (
                              <p key={index}>{paragraph}</p>
                            ))
                          : faq.answer
                        }
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            ) : (
              // Show welcome message when no category is selected
              <div className="text-center py-12">
                <h3 className="text-2xl text-textSecondary mb-4">
                  Welcome to our FAQ section
                </h3>
                <p className="text-textSecondary/80">
                  Please select a category from the sidebar to view specific questions and answers.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 