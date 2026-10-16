import React, { useState } from 'react';
import { X, Check, Crown, Zap, Shield, CreditCard, Lock, Sparkles } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: string;
  planPrice: number;
  onConfirmUpgrade: (planName: string, addedCredits: number) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
  planPrice,
  onConfirmUpgrade,
}) => {
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 9204');
  const [expiry, setExpiry] = useState('08/29');
  const [cvc, setCvc] = useState('888');
  const [coupon, setCoupon] = useState('CYBERPUNK');
  const [couponApplied, setCouponApplied] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const discount = couponApplied ? Math.round(planPrice * 0.2) : 0;
  const finalPrice = Math.max(0, planPrice - discount);
  const creditsToAdd = selectedPlan.includes('Enterprise') ? 5000 : 1000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onConfirmUpgrade(selectedPlan, creditsToAdd);
        setIsSuccess(false);
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-purple-500/40 bg-[#0c0c18] p-6 shadow-[0_0_50px_rgba(168,85,247,0.35)]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05]"
        >
          <X className="h-5 w-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.5)]">
              <Check className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Upgrade Successful!</h3>
            <p className="text-xs text-slate-300">
              Welcome to <strong>{selectedPlan}</strong>. {creditsToAdd.toLocaleString()} credits have been credited to your neural wallet.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                <Crown className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Upgrade to {selectedPlan}</h3>
                <p className="text-xs text-slate-400">Unlock high-priority 4K video neural synthesis</p>
              </div>
            </div>

            {/* Plan perks breakdown */}
            <div className="mb-5 rounded-xl border border-purple-900/40 bg-[#07070e] p-4 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-300">
                <span>Selected Plan</span>
                <span className="font-bold text-white">{selectedPlan}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Instant Compute Grant</span>
                <span className="font-mono text-cyan-300 font-bold flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                  +{creditsToAdd.toLocaleString()} Credits
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Video Resolution</span>
                <span className="font-mono text-purple-300">4K Ultra HD (60 FPS)</span>
              </div>
              <div className="pt-2 border-t border-purple-900/40 flex items-center justify-between text-sm font-bold">
                <span className="text-white">Total Due Today</span>
                <div className="text-right">
                  {couponApplied && (
                    <span className="text-xs text-slate-500 line-through mr-2 font-mono">
                      ${planPrice}
                    </span>
                  )}
                  <span className="font-mono text-cyan-400">${finalPrice}</span>
                </div>
              </div>
            </div>

            {/* Simulated Payment Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Payment Method
                </label>
                <div className="flex items-center gap-2 p-2.5 rounded-lg border border-purple-900/40 bg-[#07070e] text-xs text-slate-200">
                  <CreditCard className="h-4 w-4 text-cyan-400" />
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="flex-1 bg-transparent focus:outline-none font-mono"
                    placeholder="Card Number"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-14 bg-transparent text-right focus:outline-none font-mono"
                      placeholder="MM/YY"
                    />
                    <input
                      type="text"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      className="w-10 bg-transparent text-right focus:outline-none font-mono"
                      placeholder="CVC"
                    />
                  </div>
                </div>
              </div>

              {/* Promo code */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
                  <span>Promo Code</span>
                  {couponApplied && <span className="text-emerald-400">20% Cyberpunk Discount Applied</span>}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="flex-1 rounded-lg bg-[#07070e] border border-purple-900/40 px-3 py-1.5 text-xs font-mono uppercase text-slate-200 focus:outline-none focus:border-cyan-400"
                    placeholder="ENTER CODE"
                  />
                  <button
                    type="button"
                    onClick={() => setCouponApplied(true)}
                    className="px-3 py-1.5 rounded-lg bg-purple-900/40 border border-purple-500/40 text-xs font-semibold text-purple-300 hover:bg-purple-900/60"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full relative group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-purple-600 to-pink-500 py-3 text-xs font-bold text-white shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:shadow-[0_0_35px_rgba(168,85,247,0.7)] transition-all disabled:opacity-50"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>{isProcessing ? 'Authorizing Quantum Transaction...' : `Confirm & Upgrade ($${finalPrice})`}</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
                <Shield className="h-3 w-3 text-emerald-400" />
                <span>256-bit TLS encrypted transaction · Instant tier activation</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
