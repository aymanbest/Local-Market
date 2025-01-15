import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { CreditCard, Plus, Trash2, Edit2, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from './ui/Button';

const PaymentMethods = () => {
  const [showAddCard, setShowAddCard] = useState(false);
  const [cards, setCards] = useState([
    {
      id: 1,
      type: 'Visa',
      last4: '4242',
      expiry: '12/24',
      isDefault: true,
      cardholderName: 'John Doe'
    },
    {
      id: 2,
      type: 'Mastercard',
      last4: '8888',
      expiry: '08/25',
      isDefault: false,
      cardholderName: 'John Doe'
    }
  ]);

  const [newCard, setNewCard] = useState({
    cardNumber: '',
    cardholderName: '',
    expiry: '',
    cvv: ''
  });

  const handleAddCard = (e) => {
    e.preventDefault();
    // Add validation and card processing logic here
    const card = {
      id: cards.length + 1,
      type: 'New Card',
      last4: newCard.cardNumber.slice(-4),
      expiry: newCard.expiry,
      isDefault: false,
      cardholderName: newCard.cardholderName
    };
    setCards([...cards, card]);
    setNewCard({ cardNumber: '', cardholderName: '', expiry: '', cvv: '' });
    setShowAddCard(false);
  };

  const setDefaultCard = (cardId) => {
    setCards(cards.map(card => ({
      ...card,
      isDefault: card.id === cardId
    })));
  };

  const deleteCard = (cardId) => {
    setCards(cards.filter(card => card.id !== cardId));
  };

  const getCardIcon = (type) => {
    return <CreditCard className={`w-6 h-6 ${
      type.toLowerCase() === 'visa' ? 'text-blue-600' : 
      type.toLowerCase() === 'mastercard' ? 'text-red-500' : 
      'text-gray-600'
    }`} />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>
        <p className="text-gray-500 mt-1">Manage your payment methods and preferences</p>
      </div>

      {/* Add New Card Button */}
      {!showAddCard && (
        <Button 
          onClick={() => setShowAddCard(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="w-5 h-5" />
          Add New Card
        </Button>
      )}

      {/* Add New Card Form */}
      {showAddCard && (
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-green-500" />
              Add New Card
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddCard} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  value={newCard.cardNumber}
                  onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={newCard.cardholderName}
                  onChange={(e) => setNewCard({ ...newCard, cardholderName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={newCard.expiry}
                    onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={newCard.cvv}
                    onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="123"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddCard(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Add Card
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Saved Cards */}
      <div className="space-y-4">
        {cards.map((card) => (
          <Card key={card.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getCardIcon(card.type)}
                  <div>
                    <p className="font-medium text-gray-900">
                      {card.type} ending in {card.last4}
                    </p>
                    <p className="text-sm text-gray-500">
                      Expires {card.expiry}
                    </p>
                  </div>
                  {card.isDefault && (
                    <span className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      <CheckCircle2 className="w-4 h-4" />
                      Default
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {!card.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDefaultCard(card.id)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Set as Default
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteCard(card.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods; 