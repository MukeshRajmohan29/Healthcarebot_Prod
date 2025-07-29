import React from 'react';
import { ChevronDown, ChevronUp, Shield, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../utils/cn';

const PrivacyDisclosure = ({ privacyStyle, isVisible, onToggle }) => {
  const privacyConfigs = {
    minimal: {
      title: "Privacy Notice",
      icon: Shield,
      content: "Your conversations are private and secure. We do not collect personal identifying information.",
      className: "privacy-minimal"
    },
    contextual: {
      title: "Privacy & Data Use",
      icon: Info,
      content: "We collect conversation data to improve our service. Sensitive information is handled with extra care and only used for providing relevant health guidance.",
      className: "privacy-contextual"
    },
    progressive: {
      title: "Comprehensive Privacy Information",
      icon: AlertTriangle,
      content: "Your privacy is important to us. We collect conversation data to provide personalized health guidance. Data is encrypted, anonymized, and never shared with third parties. You can request data deletion at any time.",
      className: "privacy-progressive"
    }
  };

  const config = privacyConfigs[privacyStyle];
  if (!config || !config.content) return null;
  const IconComponent = config.icon;

  if (privacyStyle === 'minimal') {
    return (
      <div className={cn("privacy-banner", config.className)}>
        <div className="flex items-center gap-2">
          <IconComponent className="w-4 h-4" />
          <span className="font-medium text-sm">{config.title}</span>
        </div>
        <p className="text-sm mt-1">{config.content}</p>
      </div>
    );
  }

  if (privacyStyle === 'contextual') {
    return (
      <div className={cn("privacy-banner", config.className)}>
        <div className="flex items-center gap-2">
          <IconComponent className="w-4 h-4" />
          <span className="font-medium text-sm">{config.title}</span>
        </div>
        <p className="text-sm mt-1">{config.content}</p>
      </div>
    );
  }

  if (privacyStyle === 'progressive') {
    return (
      <div className={cn("privacy-banner privacy-progressive p-4 rounded-lg border border-blue-300 bg-blue-50")}> 
        <div className="flex items-center gap-2 mb-2">
          <IconComponent className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-base">{config.title}</span>
        </div>
        <p className="text-sm leading-relaxed mb-2">{config.content}</p>
        <div className="mt-2 pt-2 border-t border-current border-opacity-20">
          <p className="text-xs text-gray-900">
            This information is provided to ensure transparency about how your data is handled during our conversation.
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default PrivacyDisclosure; 