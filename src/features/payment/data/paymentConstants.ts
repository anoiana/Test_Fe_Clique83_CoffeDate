import { Shield, UtensilsCrossed, Users, CreditCard, Wallet, Smartphone, Crown, Zap } from 'lucide-react';

/**
 * Payment Feature: Shared Constants
 * Centralized payment methods and membership benefits data.
 */

export const PAYMENT_METHODS = [
  { id: 'payos', labelKey: 'payment.methods.payos.label', icon: Smartphone, subtitleKey: 'payment.methods.payos.subtitle' },
];

export const DATE_INCLUSIONS = [
  { icon: Shield, textKey: "payment.inclusions.environment" },
  { icon: UtensilsCrossed, textKey: "payment.inclusions.table" },
  { icon: Users, textKey: "payment.inclusions.facilitation" },
];

export const MEMBERSHIP_BENEFITS = [
  { icon: Shield, titleKey: "payment.benefits.verified.title", textKey: "payment.benefits.verified.text" },
  { icon: Users, titleKey: "payment.benefits.matching.title", textKey: "payment.benefits.matching.text" },
  { icon: Crown, titleKey: "payment.benefits.experiences.title", textKey: "payment.benefits.experiences.text" },
  { icon: Zap, titleKey: "payment.benefits.support.title", textKey: "payment.benefits.support.text" },
];
