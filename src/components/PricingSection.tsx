import React, { useState } from 'react';
import { Check, Zap, Sparkles, ShieldCheck, Crown, Cpu, Star } from 'lucide-react';

interface PricingSectionProps {
  onSelectPlan: (planName: string, price: number) => void;
  currentPlan?: string;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  onSelectPlan,
  currentPlan = 'Free Starter',
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const plans = [
    {
      id: 'free',
      name: 'Free Starter',
      badge: 'EXPLORER',
      target: 'For hobbyists experimenting with AI video generation',
      priceMonthly: 0,
      priceYearly: 0,
      credits: '50 Credits / month',
      features: [
        'Standard 720p & 1080p generation',
        'Max 5s video duration',
        'Standard GPU queue (15-30s wait)',
        'Basic camera controls (Pan, Zoom)',
        'Standard community support',
      ],
      nonFeatures: ['No 4K UHD rendering', 'Watermark on exports', 'Personal non-commercial use'],
      isPopular: false,
      buttonText: currentPlan === 'Free Starter' ? 'Current Plan' : 'Select Free',
      glowColor: 'cyan',
    },
    {
      id: 'pro',
      name: 'Pro Creator',
      badge: 'MOST POPULAR',
      target: 'For content creators, indie filmmakers & digital artists',
      priceMonthly: 19,
      priceYearly: 14,
      credits: '1,000 Credits / month (~100 videos)',
      features: [
        'Ultra 4K UHD 60 FPS rendering',
        'Extended durations (5s, 10s, 30s)',
        'Priority Tensor H100 GPU speed',
        'Full camera dynamic controls & Tilt/Orbit',
        'Watermark-free downloads',
        'Full commercial usage rights',
        'Prompt history & remix studio',
      ],
      nonFeatures: [],
      isPopular: true,
      buttonText: currentPlan === 'Pro Creator' ? 'Active Plan' : 'Upgrade to Pro',
      glowColor: 'purple',
    },
    {
      id: 'enterprise',
      name: 'Studio Enterprise',
      badge: 'UNLIMITED POWER',
      target: 'For VFX studios, creative agencies & game developers',
      priceMonthly: 79,
      priceYearly: 59,
      credits: '5,000 Credits + Turbo Refill',
      features: [
        'All Pro Creator capabilities included',
        'Zero-wait instant dedicated GPU queue',
        'API access for automated batch rendering',
        'Custom LoRA checkpoint training',
        'Multi-seat collaboration (up to 10 creators)',
        'Dedicated 24/7 technical engineer',
        'SLA guaranteed 99.9% uptime',
      ],
      nonFeatures: [],
      isPopular: false,
      buttonText: currentPlan === 'Studio Enterprise' ? 'Active Plan' : 'Get Studio Access',
      glowColor: 'blue',
    },
  ];

  return (
    <div className="py-6 max-w-6xl mx-auto space-y-10">
      {/* Title & Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/50 border border-purple-500/30 text-xs font-semibold text-purple-300">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>Transparent Cyberpunk Compute Pricing</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Supercharge Your <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Creative Velocity</span>
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Choose the right compute bandwidth for your workflow. Switch plans or cancel anytime with zero lock-in.
        </p>

        {/* Billing Toggle (Monthly / Annual) */}
        <div className="pt-3 flex items-center justify-center gap-3">
          <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}>
            Monthly Billing
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="relative h-7 w-14 rounded-full bg-[#121124] border border-purple-700/50 p-1 transition-colors focus:outline-none"
            aria-label="Toggle annual billing"
          >
            <div
              className={`h-5 w-5 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 shadow-md transform transition-transform ${
                billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-400'}`}>
              Annual Billing
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
              Save 25% + 2 Mo Free
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {plans.map((plan) => {
          const price = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;
          const isCurrent = currentPlan === plan.name;

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col justify-between rounded-2xl p-6 transition-all duration-300 ${
                plan.isPopular
                  ? 'bg-gradient-to-b from-[#13102d] to-[#0c0c18] border-2 border-purple-500 shadow-[0_0_35px_rgba(168,85,247,0.35)] scale-105 z-10'
                  : 'bg-[#0c0c17]/90 border border-purple-900/30 hover:border-cyan-500/40'
              }`}
            >
              {/* Highlight ribbon */}
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 px-3.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-black shadow-lg">
                  {plan.badge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  {!plan.isPopular && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-slate-400">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 min-h-[32px]">{plan.target}</p>

                {/* Price Display */}
                <div className="mt-4 mb-4 flex items-baseline gap-1.5 border-b border-purple-900/30 pb-4">
                  <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white">
                    ${price}
                  </span>
                  <span className="text-xs text-slate-400">
                    {price === 0 ? 'forever' : billingCycle === 'yearly' ? '/month, billed yearly' : '/month'}
                  </span>
                </div>

                {/* Credits callout */}
                <div className="mb-5 flex items-center gap-2 rounded-lg bg-purple-950/40 border border-purple-900/50 p-2.5 text-xs">
                  <Zap className="h-4 w-4 text-yellow-400 fill-yellow-400 shrink-0" />
                  <span className="font-semibold text-slate-200">{plan.credits}</span>
                </div>

                {/* Features List */}
                <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <div className="h-4 w-4 rounded-full bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-2.5 w-2.5 text-cyan-400" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                  {plan.nonFeatures.map((feat, idx) => (
                    <li key={`non-${idx}`} className="flex items-start gap-2.5 text-slate-500 line-through">
                      <div className="h-4 w-4 rounded-full bg-slate-900 flex items-center justify-center shrink-0 mt-0.5 text-slate-600">
                        ×
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Call to action */}
              <button
                onClick={() => onSelectPlan(plan.name, price)}
                disabled={isCurrent}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                  isCurrent
                    ? 'bg-white/[0.08] text-slate-400 cursor-default border border-slate-700'
                    : plan.isPopular
                    ? 'bg-gradient-to-r from-cyan-400 via-purple-600 to-pink-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.7)] hover:scale-[1.02]'
                    : 'bg-white/[0.05] hover:bg-white/[0.1] text-white border border-purple-800/60'
                }`}
              >
                {plan.isPopular && <Crown className="h-3.5 w-3.5 text-cyan-200" />}
                <span>{plan.buttonText}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* FAQ / Trust strip */}
      <div className="mt-12 rounded-xl border border-purple-900/30 bg-[#0c0c17]/60 p-6 flex flex-col md:flex-row items-center justify-around gap-6 text-center md:text-left text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0" />
          <div>
            <h4 className="font-semibold text-slate-200">Commercial Copyright Protection</h4>
            <p className="text-[11px]">All generated media assets belong 100% to you with no royalties.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Cpu className="h-6 w-6 text-cyan-400 shrink-0" />
          <div>
            <h4 className="font-semibold text-slate-200">High-Performance Neural Clusters</h4>
            <p className="text-[11px]">Powered by NVIDIA H100 Tensor cores with sub-minute synthesis.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
